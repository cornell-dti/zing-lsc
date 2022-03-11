const nodemailer = require('nodemailer')
const express = require('express')
const router = express.Router()
import { matched } from './templates/Matched'

var transport = {
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'retta.keebler47@ethereal.email',
    pass: 'TH6peHYbjTQeHJUBCd',
  },
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((err, succs) => {
  if (err) {
    console.log('transporter error: ', err)
  } else {
    console.log('... # Nodemailer transporter working ✅ ')
  }
})

//Test Route
router.post('/test', (req, res, next) => {
  res.json('hello')
})

const localMessage = `<div> Dear students, <div> my local message 1 </div>
  <div> Best, the LSC. </div></div>`

// Route for sending an email
router.post('/send', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.messageHtml

  let mail = {
    from: 'zhanliam21@gmail.com',
    to: `wi37u2zcwxyqd7nu@ethereal.email, retta.keebler47@ethereal.email`,
    cc: ``,
    subject: `Cornell LSC Student Matching Results`,
    html: matched,
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail',
      })
    } else {
      res.json({
        msg: 'success',
        email: message,
      })
      console.log('message sent')
    }
  })
})

module.exports = router
