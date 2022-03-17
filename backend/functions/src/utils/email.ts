import { Router } from 'express'
import * as nodemailer from 'nodemailer'
import { config } from 'dotenv'

const router = Router()
config()

import * as emails from './templates/emails'

async function testAccount() {
  nodemailer.createTestAccount()
}
testAccount()

const transport = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((err, succ) => {
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

function parseRecipients(recipients: string[]) {
  let res = ''
  recipients.forEach((e) => {
    res += ', ' + e
  })
  return res
}

// Route for sending an email
router.post('/send', (req, res, next) => {
  const {
    // name,
    // email,
    recipientsList,
    message,
    template,
    newStudent,
    existingStudents,
    className,
    customBody,
  } = req.body

  const recipients = parseRecipients(recipientsList)
  //  [body] can be of type email.
  // {
  //   matched, firstNoMatch, secondNoMatch, addStudent,
  //   lateAddStudent, askJoinGroup, checkIn, custom
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
    case 'custom': {
      body = emails.custom(customBody)
      break
    }
    default: {
      body = 'LSC did not select a valid email template.'
      break
    }
  }

  type mailType = {
    from: string
    to: string
    cc: string
    subject: string
    html: string
  }

  const mail: mailType = {
    from: ' "Cornell LSC Study Partners" <lscstudypartners@gmail.com>',
    to: `jewell.schultz19@ethereal.email, wz282@cornell.edu`,
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
