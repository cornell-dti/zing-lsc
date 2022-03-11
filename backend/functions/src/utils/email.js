const nodemailer = require('nodemailer')
const express = require('express')
const router = express.Router()
import * as emails from './templates/Matched'

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

function parseRecipients(recipients) {
  let res = ''
  recipients.forEach((e) => {
    res += ', ' + e
  })
  return res
}

// Route for sending an email
router.post('/send', (req, res, next) => {
  const {
    name,
    email,
    recipientsList,
    message,
    template,
    newStudent,
    existingStudents,
    className,
  } = req.body

  const recipients = parseRecipients(recipientsList)
  //  [body] can be of type email.
  // {
  //   matched, firstNoMatch, secondNoMatch, addStudent,
  //   lateAddStudent, askJoinGroup, checkIn
  // }
  let body
  switch (template) {
    case 'matched': {
      body = emails.matched()
      break
    }
    case 'firstNoMatch': {
      body = emails.firstNoMatch(className)
      break
    }
    case 'secondNoMatch': {
      body = emails.secondNoMatch()
      break
    }
    case 'addStudent': {
      body = emails.addStudent()
      break
    }
    case 'lateAddStudent': {
      body = emails.lateAddStudent()
      break
    }
    case 'askJoinGroup': {
      body = emails.askJoinGroup(newStudent, existingStudents)
      break
    }
    case 'checkIn': {
      body = emails.checkIn()
      break
    }
    default: {
      body = 'LSC did not select a valid email template.'
      break
    }
  }

  let mail = {
    from: 'zhanliam21@gmail.com',
    to: `wi37u2zcwxyqd7nu@ethereal.email, retta.keebler47@ethereal.email`,
    cc: `${recipients}`,
    subject: `Cornell LSC Student Matching Results`,
    html: body,
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
