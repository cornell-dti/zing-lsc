import axios from 'axios'
import functions from 'firebase-functions'

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

/* Create Email As JSON creates the main GRAPH API request body data.  */
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

/* Send Mails is takes the 
    from: sender (admin's email)
    message: graph api request body data
    authToken: string that must match the [from] email and 
      logged in user
    
    Sends a POST request to the GRAPH API. 
    
    Returns: 
      202 (:number) if successfully sent. 
      Other if email failed to send. 
        - Bad AUTH or else. Frontend will then parse this response 
        - Either relogin once (?) 
      */
export const sendMails = async (
  from: string,
  message: any,
  authToken: string
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
    return response.status
  } catch (error) {
    functions.logger.error(
      from +
        ' failed to send an email to matched students. Data sent: ' +
        JSON.stringify(message)
    )
    return error
  }
}
