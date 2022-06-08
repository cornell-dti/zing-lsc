import axios from 'axios'

// firebase imports
import admin from 'firebase-admin'
import { db } from '../config'
const courseRef = db.collection('courses')

// ==== Timestamp helper functions

type timestampsType = { [key: string]: string }

const timestamps: timestampsType = {
  'Share matched results': 'shareMatchEmailTimestamp',
  'First no match notification': 'checkInEmailTimestamp',
  'Second no match notification': 'firstNoMatchEmailTimestamp',
  'Request to add student to group': 'secondNoMatchEmailTimestamp',
  'Request to add student to group (late)': 'addStudentEmailTimestamp',
  'Ask to join group': 'lateAddStudentEmailTimestamp',
  'Check in with groups': 'askJoinGroupEmailTimestamp',
}

const getTimestampField = (template: string) => {
  return timestamps[template]
}

/** Updating Email Sent Timestap:
 * @param courseId is the string courseId usually in the form of a six-digit number such as 358546.
 * @param group is the group for the given course that emails were sent to.
 * @param template is the name of the template of the email being sent. Matched emailTemplates.js names made by sean. Currently is the string value, may change to the variable value in future (less wordy).
 * @result updates database to have email sent timestamp to current time.
 *  */
export const updateEmailTimestamp = async (
  courseId: string,
  group: string,
  template: string
) => {
  const time = admin.firestore.FieldValue.serverTimestamp()
  const timestampField = getTimestampField(template)
  // must be string format -> parse here or when calling function
  await courseRef
    .doc(courseId)
    .collection('groups')
    .doc(group)
    .update({ [timestampField]: time })
}

/* ==== Emailing Helper Functions ==== */
const GRAPH_ENDPOINT = 'https://graph.microsoft.com'

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
    @param courseId: 6-digit course id 
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
  group: string,
  template: string
) => {
  const access_token = authToken
  try {
    const response = await axios({
      url: `${GRAPH_ENDPOINT}/v1.0/users/${from}/sendMail`,
      // url: 'https://graph.microsoft.com/v1.0/users/wz282@cornell.edu/sendMail',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(message),
    })
    if (response.status === 202) {
      await updateEmailTimestamp(courseId, group, template)
    }
    return response.status
  } catch (error) {
    return error
  }
}
