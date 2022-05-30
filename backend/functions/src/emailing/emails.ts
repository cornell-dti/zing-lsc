import express from 'express'
import { createEmailAsJson, sendMails } from './functions'

const router = express()

/* 

    /send endpoint in our backend server. 

    POST Req.body needs: 

      - emailAddress (admin/user email)
      - authToken (must match admin email account)
      - emailBody 
      - emailSubject
      - emailRcpts (student email string list )

    Returns: 
      SUCC -> res.status = 201 
      FAIL -> res.status = 401 

    */
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
      res.json('Email send success.')
      res.status(201)
    } else {
      res.json('Email send failure.')
      res.status(401)
    }
  })
})

export default router
