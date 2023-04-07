import axios from 'axios'

// firebase imports
import admin from 'firebase-admin'
import { logger } from 'firebase-functions'
import { db } from '../config'
import {
  EmailTemplate,
  FirestoreEmailTemplate,
  FirestoreStudent,
} from '../types'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'
import { ClientSecretCredential } from '@azure/identity'
import { config } from 'dotenv'
import 'isomorphic-fetch'

const courseRef = db.collection('courses')
const studentRef = db.collection('students')
const templateRef = db.collection('email_templates')

config()

// ==== Timestamp helper functions

/** Updating Group Email Sent Timestamp:
 * @param courseId is the string courseId usually in the form of a roster and six-digit number such as SU22-358546.
 * @param group is the group for the given course that emails were sent to.
 * @param templateId is the ID of the template of the email being sent.
 * @result updates database to have email sent timestamp to current time.
 *  */
export const updateGroupTimestamp = async (
  courseId: string,
  group: string,
  templateId: string
) => {
  const templateRef = `templateTimestamps.${templateId}`

  // must be string format -> parse here or when calling function
  return courseRef
    .doc(courseId)
    .collection('groups')
    .doc(group)
    .update({ [templateRef]: admin.firestore.Timestamp.now() })
}

/**
 * Updating Individual Email Sent Timestamp:
 * @param courseId is the string courseId usually in the form of a roster and six-digit number such as SU22-358546.
 * @param email is the cornell.edu email of the student that the email was sent to.
 * @param templateId is the ID of the template of the email being sent.
 * @result updates database by setting the email sent timestamp to the current time.
 */
export const updateIndivTimestamp = async (
  courseId: string,
  email: string,
  templateId: string
) => {
  const studentDocRef = studentRef.doc(email)
  const studentDoc = await studentDocRef.get()

  if (!studentDoc.exists) {
    throw new Error(`Student document for ${email} does not exist`)
  }
  const studentData = studentDoc.data() as FirestoreStudent

  const groups = studentData.groups
  const groupMembership = groups.find((group) => group.courseId === courseId)
  if (!groupMembership) {
    throw new Error(`Student ${email} does not have membership in ${courseId}`)
  }

  groupMembership.templateTimestamps[templateId] =
    admin.firestore.Timestamp.now()

  await studentDocRef.update({ groups })
}

/* ==== Emailing Helper Functions ==== */
const GRAPH_ENDPOINT = 'https://graph.microsoft.com'

/**
 * Returns the list of recipients of an email based on group/individual membership
 * @param courseId is the string courseId usually in the form of a roster and six-digit number such as SU22-358546.
 * @param group is the group recieving the email for the given course (if the email is being sent to a group)
 * @param indivEmail is the email of the individual recipient recieving the email (if the email is being sent to an individual)
 * @returns an array of email recipients based on the given group/individual
 */
async function getRecipients(
  courseId: string,
  group?: string,
  indivEmail?: string
) {
  let emailRcpts = ['lscstudypartners@cornell.edu']

  if (group && indivEmail) {
    throw new Error('group and indivEmail cannot both be specified')
  }

  if (group && parseInt(group) > 0) {
    const groupData = await courseRef
      .doc(courseId)
      .collection('groups')
      .doc(group)
      .get()

    emailRcpts = [...emailRcpts, ...(groupData.data() as any).members]
  }

  if (indivEmail) {
    emailRcpts = [...emailRcpts, indivEmail]
  }

  return emailRcpts
}

/* Add Recipients parses frontend data and adds to
    the 'toRecipients' key-value pair of
    the email request body sent to the MS Graph API */
function addRecipients(messageBody: any, rcpts = []) {
  const cloned = Object.assign({}, messageBody)
  if (rcpts.length > 0) {
    cloned.message['toRecipients'] = createRecipients(rcpts)
  }
  return cloned
}

/* Create Recipients parses the rcpts (string list of student emails)
    sent from the frontend. Called in addRecipients. */
function createRecipients(rcpts: string[]) {
  return rcpts.map((rcpt) => ({ emailAddress: { address: rcpt } }))
}

/** Create Email As JSON creates the main GRAPH API request body data.
 * @param rcpts is a list of student emails
 * @param subject is the subject line. Usually "Study Partners!"
 * @param body is the HTML body of the email
 *
 * @returns the request body data for the GRAPH API send mail call
 */
export const createEmailAsJson = (
  rcpts: any,
  subject: string,
  body: string
) => {
  let messageAsJson = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: body,
      },
      from: {
        emailAddress: {
          address: 'lscstudypartners@cornell.edu',
        },
      },
    },
  }

  messageAsJson = addRecipients(messageAsJson, rcpts)

  return messageAsJson
}

/**
 * Returns the template associated with the given template id if it exists, undefined otherwise
 * @param templateId the template id
 */
const isValidTemplate = async (templateId: string) => {
  const templateCollection = await templateRef.get()
  return templateCollection.docs
    .map((templateDoc) => templateDoc.data() as FirestoreEmailTemplate)
    .find((template) => template.id === templateId)
}

const getAuthToken = async () => {
  const credential = new ClientSecretCredential(
    process.env.MS_GRAPH_API_TENANT_ID as string,
    process.env.MS_GRAPH_API_CLIENT_ID as string,
    process.env.MS_GRAPH_API_CLIENT_SECRET_VALUE as string
  )
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['user.read', 'mail.send'],
  })

  const client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider,
  })
}

getAuthToken()

/** Send Mails takes the
    @param from: sender (admin's email)
    @param message: graph api request body data
    @param authToken: string that must match the [from] email and
      logged in user
    @param courseId: roster and 6-digit course id
    @param template: string of template ID
    @param group: group number that email is being sent to (if the email is being sent to a group)
    @param indivEmail: email of the individual recipient (if the email is being sent to an individual)

    Sends a POST request to the GRAPH API and updates the database with the timestamp of when the email was sent.

    @returns:
      202 (:number) if successfully sent.
      Other if email failed to send.
        - Bad AUTH or else. Frontend will then parse this response
        and render "Try Again" button or equivalent => User logs in and calls function again.
       */
const sendMails = async (
  from: string,
  message: any,
  authToken: string,
  courseId: string,
  template: string,
  group?: string,
  indivEmail?: string
) => {
  const validTemplate = await isValidTemplate(template)
  if (!validTemplate) {
    throw new Error(`Template with id ${template} doesn't exist`)
  }

  //not sure if this check is necessary, since emailRcpts already checks for this
  if ((!group || parseInt(group) < 0) && !indivEmail) {
    logger.error(
      ` Invalid group ${group} and invalid email ${indivEmail} for updating timestamps `
    )
    throw new Error('No valid group or individual email')
  } else if (group && indivEmail) {
    logger.error(`group and individual email cannot both be specified `)
    throw new Error('Both group and individual email are specified')
  }

  // there's no need for this client to be created over and over again everytime a call is made. but idk where to put it so it's globally accessible.
  const credential = new ClientSecretCredential(
    process.env.MS_GRAPH_API_TENANT_ID as string,
    process.env.MS_GRAPH_API_CLIENT_ID as string,
    process.env.MS_GRAPH_API_CLIENT_SECRET_VALUE as string
  )
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['user.read', 'mail.send'],
  })

  const client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider,
  })

  const response = await client
    .api('/me/sendMail')
    .post({ data: JSON.stringify(message) })

  if (response.status === 202) {
    if (group && parseInt(group) > 0) {
      await updateGroupTimestamp(courseId, group, template)
        .then(() =>
          logger.info(
            `Added timestamp for course ${courseId} for group ${group} with template ${template}`
          )
        )
        .catch((err) =>
          logger.error(
            `Failed to update timestamp for course ${courseId} for group ${group} with template ${template}. Resulted in err: ${err.message} `
          )
        )
    }

    if (indivEmail) {
      await updateIndivTimestamp(courseId, indivEmail, template)
        .then(() =>
          logger.info(
            `Added ${template} timestamp for course ${courseId} for student with email ${indivEmail}`
          )
        )
        .catch((err) =>
          logger.error(
            `Failed to update ${template} timestamp for student with email ${indivEmail} for course ${courseId}. Resulted in err: ${err.message} `
          )
        )
    }
  }
  return response.status
}

/**
 * Send Student Emails takes
 * @param from sender (admin's email)
 * @param authToken string that must match the [from] email and
      logged in user
 * @param subject is the subject line. Usually "Study Partners!"
 * @param body is the HTML body of the email
 * @param courseId roster and 6-digit course id
 * @param template string of template ID
 * @param group group number that email is being sent to (if the email is being sent to a group)
 * @param indivEmail  email of the individual recipient (if the email is being sent to an individual)
 *
 * Sends a POST request to the GRAPH API and updates the database with the timestamp of when the email was sent.
 *
 * @returns
 * 202 (:number) if successfully sent.
      Other if email failed to send.
        - Bad AUTH or else. Frontend will then parse this response
        and render "Try Again" button or equivalent => User logs in and calls function again.
 */
export const sendStudentEmails = async (
  from: string,
  authToken: string,
  subject: string,
  body: string,
  courseId: string,
  template: string,
  group?: string,
  indivEmail?: string
) => {
  const emailRcpts = await getRecipients(courseId, group, indivEmail)
  const message = createEmailAsJson(emailRcpts, subject, body)

  await sendMails(
    from,
    message,
    authToken,
    courseId,
    template,
    group,
    indivEmail
  )
    .then((result) => {
      if (result === 202) {
        logger.info(
          `Email sent successfully by ${from} to ${emailRcpts.toString()}`
        )
      } else {
        logger.error(
          `** Likely auth error ** : Email failed to send by ${from} to ${emailRcpts.toString()}`
        )

        throw Error('Email send failure')
      }
    })
    .catch((err) => {
      logger.error(
        `Email send request failed from ${from} to ${emailRcpts.toString()}`
      )
      logger.error(err.message)
      throw err
    })
}

/**
 * Get all email template information from Firestore
 * @returns list of email template information
 */
export const getEmailTemplates = async () => {
  const templateCollection = await templateRef.get()
  return templateCollection.docs
    .map((templateDoc) => templateDoc.data() as FirestoreEmailTemplate)
    .map(
      (templateData) =>
        ({
          ...templateData,
          modifyTime: templateData.modifyTime.toDate(),
        } as EmailTemplate)
    )
}

/**
 * Verify that an email template type is valid
 * @param type the type of email template
 * @throws exception if email type is unrecognized
 */
const assertValidEmailType = (type: string) => {
  const types = ['group', 'student']
  if (!types.includes(type)) {
    logger.error(`Email type ${type} is not in types [${types.join(', ')}]`)
    throw new Error(`Unrecognized email type ${type}`)
  }
}

/** Update an email template with new name, type, and subject */
export const updateEmailTemplate = async (
  id: string,
  name: string,
  type: 'group' | 'student',
  subject: string
) => {
  assertValidEmailType(type)
  return templateRef
    .doc(id)
    .update({
      name,
      type,
      subject,
      modifyTime: admin.firestore.Timestamp.now(),
    })
    .then(() =>
      logger.info(
        `Updated email template ${id} with name ${name}, type ${type}, subject ${subject}`
      )
    )
    .catch((err) => {
      if (err.message.includes('NOT_FOUND')) {
        logger.error(`Cannot update nonexistent template id ${id}`)
        throw new Error(`No email template with id ${id}`)
      } else {
        throw err
      }
    })
}

/**
 * Add a new email template with name, type, and subject.
 * @returns id of the newly created template
 */
export const addEmailTemplate = async (
  name: string,
  type: 'group' | 'student',
  subject: string
) => {
  assertValidEmailType(type)
  const templateDoc = templateRef.doc() // Needed to get the id
  return templateDoc
    .set({
      id: templateDoc.id,
      name,
      type,
      subject,
      body: `${templateDoc.id}.html`,
      modifyTime: admin.firestore.Timestamp.now(),
    })
    .then(() => {
      logger.info(
        `Added new email template ${templateDoc.id} with name ${name}, type ${type}, subject ${subject}`
      )
      return templateDoc.id
    })
}
