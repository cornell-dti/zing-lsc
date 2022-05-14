import { Router } from 'express'
import { checkAuth } from '../middleware/auth-middleware'
const router = Router()

import { addStudentSurveyResponse, removeStudent } from './functions'

router.post('/survey', (req, res) => {
  const { name, email, college, year, courseCatalogNames } = req.body

  addStudentSurveyResponse(name, email, college, year, courseCatalogNames)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      if (err.name === 'processing_err') {
        return res.status(500).send({ success: false, message: err.message })
      }
      console.log(err)
      return res.status(400).send({ success: false, message: err.message })
    })
})

router.delete('/', checkAuth, (req, res) => {
  const email = req.body.studentEmail
  removeStudent(email)
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
    })
})

export default router
