import { Router } from 'express'
import { config } from 'dotenv'
import { logger } from 'firebase-functions'

import {
  getCurrentSemester,
  setCurrentSemester,
  getAllSemesters,
  getSurveyStatus,
  setSurveyStatus,
} from './functions'

const router = Router()
config()

router.get('/semester/current', (_, res) => {
  getCurrentSemester()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      const err_msg = `Unexpected error getting semester: ${err.msg}`
      logger.error(err_msg)
      res.status(500).send({ message: err_msg })
    })
})

router.post('/semester/current', (req, res) => {
  const { semester } = req.body
  setCurrentSemester(semester)
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => {
      const err_msg = `Unexpected error change current semester to ${semester}: ${err.msg}`
      logger.error(err_msg)
      res.status(500).send({ message: err_msg })
    })
})

router.get('/semester/all', (_, res) => {
  getAllSemesters()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      const err_msg = `Unexpected error getting all semesters: ${err.message}`
      logger.error(err_msg)
      res.status(500).send({ message: err_msg })
    })
})

router.get('/semester/survey', (_, res) => {
  getSurveyStatus()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      logger.error(`Unexpected error retrieving survey opening: ${err.message}`)
      res.status(500).send({ message: err.message })
    })
})

router.post('/semester/survey', (req, res) => {
  const semester = req.body
  setSurveyStatus(semester.surveyOpen)
    .then((data) => res.status(200).send({ surveyOpen: semester.surveyOpen }))
    .catch((err) => {
      logger.error(`Unexpected error retrieving survey opening: ${err.message}`)
      res.status(500).send({ message: err.message })
    })
})

export default router
