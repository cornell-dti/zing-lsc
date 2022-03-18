import * as emails from './templates'
import * as nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()

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
    console.log(' ❌ Transporter error: ❌ \n ', err)
  } else {
    console.log(
      ' \n  ✅ Nodemailer transporter working ✅  \n Successful Message: ',
      succ
    )
  }
})

const parseRecipients = (recipients: string[]) => {
  let res = ''
  recipients.forEach((e) => {
    res += ', ' + e
  })
  return res
}

const sendEmail = (req: any, res: any) => {
  const {
    // name,
    // email,
    recipientsList,
    message,
    template,
    newStudent,
    existingStudents,
    className,
    customSubject,
    customBody,
  } = req.body

  const recipients = parseRecipients(recipientsList)
  //  [body] can be of type email.
  // {
  //   matched, firstNoMatch, secondNoMatch, addStudent,
  //   lateAddStudent, askJoinGroup, checkIn, custom
  // }
  let body
  let subject
  switch (template) {
    case 'matched': {
      body = emails.matched()
      subject = 'Cornell LSC Student Matching Results'
      break
    }
    case 'firstNoMatch': {
      body = emails.firstNoMatch(className)
      subject = 'Cornell LSC No Matches Yet'
      break
    }
    case 'secondNoMatch': {
      body = emails.secondNoMatch()
      subject = 'Cornell LSC No Matches Yet'
      break
    }
    case 'addStudent': {
      body = emails.addStudent()
      subject = 'Cornell LSC Adding a Student'
      break
    }
    case 'lateAddStudent': {
      body = emails.lateAddStudent()
      subject = 'Cornell LSC Adding a Student'
      break
    }
    case 'askJoinGroup': {
      body = emails.askJoinGroup(newStudent, existingStudents)
      subject = 'Cornell LSC Potential New Group Member'
      break
    }
    case 'checkIn': {
      body = emails.checkIn()
      subject = 'Cornell LSC Checking In!'
      break
    }
    case 'custom': {
      body = emails.custom(customBody)
      subject = customSubject
      break
    }
    default: {
      body = 'LSC did not select a valid email template.'
      subject = 'Message'
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
    subject: `${subject}`,
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
      console.log('message sent with data being:: \n ', data)
    }
  })
}

export { sendEmail }
