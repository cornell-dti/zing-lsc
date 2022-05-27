import 'dotenv/config'
import axios from 'axios'
import express from 'express'

const router = express()

const CLIENT_ID = process.env.MS_GRAPH_API_CLIENT_ID
const CLIENT_SECRET = process.env.MS_GRAPH_API_CLIENT_SECRET_VALUE
const TENANT_ID = process.env.MS_GRAPH_API_TENANT_ID
const GRAPH_ENDPOINT = 'https://graph.microsoft.com'

const recipientAddresses = {
  to: [{ address: 'zhanliam21@gmail.com', name: 'Will Zhang (gmail) To' }],
  cc: [{ address: 'willzhang21@icloud.com', name: 'Will Zhang (icloud) CC' }],
  bcc: [
    {
      address: 'lscstudypartners@cornell.edu',
      name: 'Cornell LSC Study Partners Program',
    },
  ],
}
const subject = 'Graph API Subject Line' || ''

function addRecipients(messageBody, rcpts = {}) {
  let cloned = Object.assign({}, messageBody)

  Object.keys(rcpts).forEach((element) => {
    if (rcpts[element].length > 0) {
      cloned.message[element + 'Recipients'] = createRecipients(rcpts[element])
    }
  })

  return cloned
}

function createRecipients(rcpts) {
  return rcpts.map((rcpt) => {
    return {
      emailAddress: {
        address: rcpt.address,
        name: rcpt.name || '',
      },
    }
  })
}

const createEmailAsJson = (rcpts, subject, body) => {
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

const sendMails = async (from, message, authToken) => {
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

    console.log('sendNotification status', response.statusText)
  } catch (error) {
    console.log(error)
  }
}

router.post('/send', (req, res) => {
  const body = '<h1> Test from Will Z</h1> <p> HTML msg sent via MS graph!</p>'
  const message = createEmailAsJson(recipientAddresses, subject, body)
  console.log(JSON.stringify(message, null, '  '))

  let from = req.body.emailAddress
  let authToken = req.body.authToken

  sendMails(from, message, authToken)
  res.json('emails sent')
})

/* Sample testing to check if graph route is working */
router.post('/sample', (req, res) => {
  res.json('hello')
})

export default router
