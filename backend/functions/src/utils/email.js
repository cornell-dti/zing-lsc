const nodemailer = require('nodemailer')
const express = require('express')
const router = express.Router()
const { renderEmail } = require('react-html-email')

const m = require('./templates/Matched')

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

// Route for sending an email
router.post('/send', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.messageHtml
  const renderedM = renderEmail(m)

  let mail = {
    from: 'zhanliam21@gmail.com',
    to: `wi37u2zcwxyqd7nu@ethereal.email, retta.keebler47@ethereal.email`,
    cc: `zhanliam21@gmail.com`,
    subject: `Cornell LSC Student Matching Results`,
    html: renderedM,
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail',
      })
    } else {
      res.json({
        msg: 'success',
        email: renderedM,
      })
      console.log('message sent')
    }
  })
})

module.exports = router
