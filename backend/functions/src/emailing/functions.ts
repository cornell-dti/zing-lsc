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

const courseRef = db.collection('courses')
const studentRef = db.collection('students')
const templateRef = db.collection('email_templates')

// ==== Timestamp helper functions

/** Updating Email Sent Timestap:
 * @param courseId is the string courseId usually in the form of a roster and six-digit number such as SU22-358546.
 * @param group is the group for the given course that emails were sent to.
 * @param template is the name of the template of the email being sent. Matched emailTemplates.js names made by sean. Currently is the string value, may change to the variable value in future (less wordy).
 * @result updates database to have email sent timestamp to current time.
 *  */
export const updateEmailTimestamp = (
  courseId: string,
  group: string,
  templateID: string
) => {
  const time = admin.firestore.FieldValue.serverTimestamp()
  // must be string format -> parse here or when calling function
  return courseRef
    .doc(courseId)
    .collection('groups')
    .doc(group)
    .update({ [templateID]: time })
}

export const updateIndivTimestamp = async (
  courseId: string,
  email: string,
  templateID: string
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

  groupMembership.templateTimestamps[templateID] =
    admin.firestore.Timestamp.now()

  await studentDocRef.update({ groups })
}

/* ==== Emailing Helper Functions ==== */
const GRAPH_ENDPOINT = 'https://graph.microsoft.com'

export async function getRecipients(
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

/** Send Mails is takes the 
    @param from: sender (admin's email)
    @param message: graph api request body data
    @param authToken: string that must match the [from] email and 
      logged in user
    @param courseId: roster and 6-digit course id 
    @param group: group number that email is being sent to
    @param template: string of template name
    
    Sends a POST request to the GRAPH API and updates the database with the timestamp of when the email was sent. 
    
    @returns: 
      202 (:number) if successfully sent. 
      Other if email failed to send. 
        - Bad AUTH or else. Frontend will then parse this response 
        and render "Try Again" button or equivalent => User logs in and calls function again. 
       */
export const sendMails = async (
  from: string,
  message: any,
  authToken: string,
  courseId: string,
  group?: string,
  template = 'Share matched results',
  indivEmail?: string
) => {
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

  try {
    const response = await axios({
      url: `${GRAPH_ENDPOINT}/v1.0/users/${from}/sendMail`,
      // url: 'https://graph.microsoft.com/v1.0/users/wz282@cornell.edu/sendMail',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + authToken,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(message),
    })

    if (response.status === 202) {
      if (group && parseInt(group) > 0) {
        await updateEmailTimestamp(courseId, group, template)
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
              `Added no match timestamp for course ${courseId} for student with email ${indivEmail}`
            )
          )
          .catch((err) =>
            logger.error(
              `Failed to update no match timestamp for student with email ${indivEmail} for course ${courseId}. Resulted in err: ${err.message} `
            )
          )
      }
    }
    return response.status
  } catch (error) {
    return error
  }
}

export const sendStudentEmails = async (
  from: string,
  authToken: string,
  subject: string,
  body: string,
  courseId: string,
  group?: string,
  template = 'Share matched results',
  indivEmail?: string
) => {
  const emailRcpts = await getRecipients(courseId, group, indivEmail)
  const message = createEmailAsJson(emailRcpts, subject, body)

  await sendMails(
    from,
    message,
    authToken,
    courseId,
    group,
    template,
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

      throw err
    })
}

/** Get all email template information from Firestore */
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
