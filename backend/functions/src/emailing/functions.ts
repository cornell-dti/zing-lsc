import axios from 'axios'

const GRAPH_ENDPOINT = 'https://graph.microsoft.com'

function addRecipients(messageBody: any, rcpts = []) {
  const cloned = Object.assign({}, messageBody)
  if (rcpts.length > 0) {
    cloned.message['toRecipients'] = createRecipients(rcpts)
  }
  return cloned
}

function createRecipients(rcpts: string[]) {
  return rcpts.map((rcpt) => {
    return {
      emailAddress: {
        address: rcpt,
      },
    }
  })
}

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
    return error
  }
}
