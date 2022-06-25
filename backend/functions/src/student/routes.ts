import { Router } from 'express'
/* logger.x used for summer testing and catching any live bugs. */
import { logger } from 'firebase-functions'
import { checkAuth } from '../middleware/auth-middleware'
const router = Router()

import { addStudentSurveyResponse, removeStudent } from './functions'

router.post('/survey', (req, res) => {
  const { name, email, college, year, courseCatalogNames } = req.body
  const userAgent = req.get('user-agent')
  logger.info(
    `Student [${name}] submitted survey using ${email} on agent ${userAgent}`
  )

  addStudentSurveyResponse(name, email, college, year, courseCatalogNames)
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

export default router
