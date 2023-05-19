import { Router } from 'express'
/* logger.x used for summer testing and catching any live bugs. */
import { logger } from 'firebase-functions'
import { checkAuth } from '../middleware/auth-middleware'
const router = Router()

import {
  addStudentSurveyResponse,
  getAllStudents,
  removeStudent,
  updateStudentNotes,
  archiveStudent,
} from './functions'

router.get('/', (_, res) => {
  getAllStudents()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      logger.error(`Unexpected error getting all students: ${err.message}`)
      res.status(500).send({ message: err.message })
    })
})

router.post('/survey', (req, res) => {
  const { name, email, college, year, courseCatalogNames, surveySubmittable } =
    req.body
  const userAgent = req.get('user-agent')
  logger.info(
    `Student [${name}] submitted survey using ${email} on agent ${userAgent}`
  )

  addStudentSurveyResponse(
    name,
    email,
    college,
    year,
    courseCatalogNames,
    surveySubmittable
  )
    .then((data) => res.status(200).json({ success: true, data }))
    .catch((err) => {
      logger.error(
        `ERROR in Student [${name}] submitted survey using ${email} on agent ${userAgent}`,
        err.message
      )
      if (err.name === 'processing_err') {
        return res.status(500).send({ success: false, message: err.message })
      }
      return res.status(400).send({ success: false, message: err.message })
    })
})

router.post('/notes', (req, res) => {
  const { email, courseId, notes } = req.body
  updateStudentNotes(email, courseId, notes)
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => {
      logger.error(
        `Error updating notes for [${courseId}] in student [${email}] to [${notes}]: ${err.message}`
      )
      res.status(400).send({ success: false, message: err.message })
    })
})

router.delete('/', checkAuth, (req, res) => {
  const email = req.body.studentEmail
  logger.info(`Student [${email}] deleted.`)
  removeStudent(email)
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
    })
})

router.post('/archive', (req, res) => {
  const { email, courseId } = req.body
  archiveStudent(email, courseId)
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
    })
})

export default router
