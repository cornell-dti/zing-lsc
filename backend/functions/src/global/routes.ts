import { Router } from 'express'
import { config } from 'dotenv'
import { logger } from 'firebase-functions'
import {
  getCurrentSemester,
  getAllSemesters,
  getSurveyStatus,
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

export default router
