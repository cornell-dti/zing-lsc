import express from 'express'
import { logger } from 'firebase-functions'
import {
  addEmailTemplate,
  getEmailTemplates,
  sendStudentEmails,
  updateEmailTemplate,
  updateEmailTimestamp,
} from './functions'

const router = express()

/**

    @.com/email/send endpoint in our backend server. 

    POST Req.body needs: 
      @param emailAddress (admin/user email)
      @param authToken (must match admin email account)
      @param emailBody 
      @param emailSubject
      @param emailRcpts (student email string list )

      @param courseId roster and 6-digit course id
      @param group group number 
      @param template string name

    @returns: 
      SUCC -> res.data = 'Email send success.' 
      FAIL -> res.data = 'Email send failure.' 

    */
router.post('/send', (req, res) => {
  const {
    emailAddress,
    authToken,
    emailSubject,
    emailBody,
    courseId,
    group,
    template,
    indivEmail,
  } = req.body

  sendStudentEmails(
    emailAddress,
    authToken,
    emailSubject,
    emailBody,
    courseId,
    group,
    template,
    indivEmail
  )
    .then(() =>
      res.status(200).json({ success: true, message: 'Email send success' })
    )
    .catch((err) =>
      res.status(400).json({ success: false, message: err.message })
    )
})

/** @.com/api root/email/timestamp
 *
 * @param courseId = string of 6-digit course code
 * @param groups = string [] of groups to be sent emails
 * @param template = is the name of the template of the email being sent. Matched emailTemplates.js names made by sean. Currently is the string value, may change to the variable value in future (less wordy).
 *
 * @yeilds email sent timestamp update in database
 */
router.post('/timestamp', (req, res) => {
  const { courseId, groups, template } = req.body
  updateEmailTimestamp(courseId, groups, template)
    .then(() => {
      logger.info(
        `Email time updated for groups ${groups.toString()} in course ${courseId}.`
      )
      res.status(200).json('Email Time updated')
    })
    .catch(() => {
      logger.warn(
        `Email time failed to update for groups ${groups.toString()} in course ${courseId}.`
      )
      res.status(400).json('ERROR: email Time update failure')
    })
})

/** Get all email template information */
router.get('/templates', (req, res) => {
  getEmailTemplates()
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      logger.error(`Error getting email templates: ${err.message}`)
      res.status(500).send({ success: false, err: err.message })
    })
})

/** Update information for an already existing email template */
router.post('/templates/update', (req, res) => {
  const { id, name, type, subject } = req.body
  updateEmailTemplate(id, name, type, subject)
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => {
      const code =
        err.message.includes('Unrecognized email type') ||
        err.message.includes('No email template with id')
          ? 400
          : 500
      if (code !== 400) {
        logger.error(`Error updating email template ${id}: ${err.message}`)
      }
      res.status(code).send({ success: false, err: err.message })
    })
})

/** Add a new template and get its automatically generated id */
router.post('/templates/add', (req, res) => {
  const { name, type, subject } = req.body
  addEmailTemplate(name, type, subject)
    .then((id) => res.status(200).send({ success: true, data: id }))
    .catch((err) => {
      const code = err.message.includes('Unrecognized email type') ? 400 : 500
      if (code !== 400) {
        logger.error(`Error adding email template ${err.message}`)
      }
      res.status(code).send({ success: false, err: err.message })
    })
})

export default router
