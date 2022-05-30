import axios from 'axios'
import express from 'express'

const router = express()

const GRAPH_ENDPOINT = 'https://graph.microsoft.com'

function addRecipients(messageBody, rcpts = []) {
  let cloned = Object.assign({}, messageBody)
  if (rcpts.length > 0) {
    cloned.message['toRecipients'] = createRecipients(rcpts)
  }
  return cloned
}

function createRecipients(rcpts) {
  return rcpts.map((rcpt) => {
    return {
      emailAddress: {
        address: rcpt,
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
    return response.status
  } catch (error) {
    return error
  }
}

router.post('/send', (req, res) => {
  const from = req.body.emailAddress
  const authToken = req.body.authToken
  const body = req.body.emailBody
  const subject = req.body.emailSubject
  const recipientAddresses = req.body.emailRcpts

  const message = createEmailAsJson(recipientAddresses, subject, body)
  console.log(JSON.stringify(message, null, '  '))

  sendMails(from, message, authToken).then((result) => {
    if (result === 202) {
      res.json('Email send success')
    } else res.json('Email send failure')
  })
})

/* Sample testing to check if graph route is working */
router.post('/sample', (req, res) => {
  res.json('hello')
})

export default router
