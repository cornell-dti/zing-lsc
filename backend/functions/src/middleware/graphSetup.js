import * as msal from '@azure/msal-node'
import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import qs from 'qs'
import { parse } from 'dotenv'

const router = express()

const REDIRECT_URI =
  'http://localhost:5001/zing-lsc/us-central1/api/graph/redirect'
const CLIENT_ID = process.env.MS_GRAPH_API_CLIENT_ID
const CLIENT_SECRET = process.env.MS_GRAPH_API_CLIENT_SECRET_VALUE
const TENANT_ID = process.env.MS_GRAPH_API_TENANT_ID
const GRAPH_ENDPOINT = 'https://graph.microsoft.com'
const AAD_ENDPOINT = 'https://login.microsoftonline.com'
// email vars
const recipientAddresses = {
  to: [{ address: 'zhanliam21@gmail.com', name: 'Will Zhang (gmail) To' }],
  cc: [{ address: 'willzhang21@icloud.com', name: 'Will Zhang (icloud) CC' }],
  bcc: [{ address: 'wz282@cornell.edu', name: 'Will Zhang (bcc) BCC' }],
}
const from = 'wz282cornell.edu' || ''
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
    },
  }

  messageAsJson = addRecipients(messageAsJson, rcpts)

  return messageAsJson
}

const getAuthToken = async () => {
  try {
    const formData = {
      grant_type: 'client_credentials',
      // scope: `${GRAPH_ENDPOINT}/.default`,
      scope: 'https://graph.microsoft.com/.default',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }

    console.log('url', `${AAD_ENDPOINT}/${TENANT_ID}/oauth2/v2.0/token`)

    const tokenObject = await axios({
      // url: `${AAD_ENDPOINT}/${TENANT_ID}/oauth2/v2.0/token`,
      url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      method: 'POST',
      data: qs.stringify(formData),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const {
      data: { access_token },
    } = tokenObject

    return access_token
  } catch (err) {
    console.log('getting Auth Token error: \n ' + err)
  }
}

const sendNotification = async (from, message) => {
  const access_token = await getAuthToken()
  try {
    const response = await axios({
      // url: `${GRAPH_ENDPOINT}/v1.0/users/${from}/sendMail`,
      url: 'https://graph.microsoft.com/v1.0/users/wz282@cornell.edu/sendMail',
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

router.post('/fullsend', (req, res) => {
  const body = '<h1> Test from Will Z</h1> <p> HTML msg sent via MS graph!</p>'
  const message = createEmailAsJson(recipientAddresses, subject, body)
  console.log(JSON.stringify(message, null, '  '))
  sendNotification(from, message)
  res.json('full sent')
})

// // using request library
// const endpoint = `${AAD_ENDPOINT}/${TENANT_ID}/oauth2/v2.0/token`
// const endpoint_common = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
// const reqParams = {
//       grant_type: "client_credentials",
//       // scope: `${GRAPH_ENDPOINT}/.default`,
//       scope: "https://graph.microsoft.com/.default",
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
// };

// let graph_token

// request.post({ url: endpoint, form: reqParams }, function (err, res, body) {
//   if (err) {
//     console.log("error")
//   }
//   else {
//     console.log("Body = " + body);
//     let parsedBody = JSON.parse(body);
//     if (parsedBody.error_description) {
//       console.log("ERROR= " + parsedBody.error_description)
//     }
//     else {
//       console.log("Access Token= " + parsedBody.access_token)
//       graph_token = parsedBody.accessToken
//     }
//   }
// })

// function testGraphAPI(accessToken) {
//   request.get({
//     url: "https://graph.microsoft.com/v1.0/users",
//     headers: {
//       "Authorization": "Bearer " + accessToken
//     }
//   }, function (err, response, body) {
//     console.log(body)
//   })
// }

// console.log("Calling function 1" + graph_token)

// const userId = "wz282@cornell.edu"

// const config = {
//   auth: {
//     CLIENT_ID,
//     CLIENT_SECRET,
//     authority: `https://login.microsoftonline.com/${TENANT_ID}`,

//     }
// }

// const authClient = new msal.ConfidentialClientApplication(config)

// router.get('/graph', (req, res) => {
//   const authCodeUrlParams = {
//     scopes: ["user.read"],
//     redirectUri: REDIRECT_URI
//   }

//   // get url to sign user in and consent to scopes needed for app
//   authClient.getAuthCodeUrl(authCodeUrlParams).then((response) => {
//     res.redirect(response)
//   }).catch((error) => console.log(JSON.stringify(error)))
// })

// router.get('/redirect', (req, res) => {
//   const tokenRequest = {
//     code: req.query.code,
//     scopes: ["user.read"],
//     redirectUri: REDIRECT_URI,
//   }

//   authClient.acquireTokenByCode(tokenRequest).then((response) => {
//     // console.log("\n Reponse: \n: ", JSON.stringify(response))
//     const accessToken = response.accessToken
//     const accountName = response.account.name
//     const accountUsername = response.account.username
//     console.log(`name: ${accountName} \n email: ${accountUsername} \n accessToken (on redirect): ${accessToken}`)

//     res.sendStatus(200);
//   }).catch((error) => {
//     console.log(error);
//     res.status(500).send(error)
//   })
// })

// router.post('/sample', (req, res) => {
//   res.json("hello")
// })

export { router }
