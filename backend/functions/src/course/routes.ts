import { Router } from 'express'
import { config } from 'dotenv'
import { logger } from 'firebase-functions'
import {
  getCourseInfo,
  getAllCourses,
  getStudentsForCourse,
  getCurrentSemester,
  setCurrentSemester,
  getAllSemesters,
  getSurveyStatus,
  setSurveyStatus,
} from './functions'

const router = Router()
config()

router.get('/:courseId', (req, res) => {
  const courseId = req.params.courseId
  getCourseInfo(courseId)
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
    })
})

router.get('/', (_, res) => {
  getAllCourses()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      logger.error(`Unexpected error getting all courses: ${err.message}`)
      res.status(500).send({ message: err.message })
    })
})

router.get('/students/:courseId', (req, res) => {
  const courseId = req.params.courseId
  getStudentsForCourse(courseId)
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
    })
})

router.get('/semester/current', (_, res) => {
  getCurrentSemester()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      logger.error(`Unexpected error getting semester: ${err.message}`)
      res.status(500).send({ message: err.message })
    })
})

router.post('/semester/current', (req, res) => {
  const { semester } = req.body
  setCurrentSemester(semester)
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
    })
})

router.get('/semester/all', (_, res) => {
  getAllSemesters()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      logger.error(`Unexpected error getting all semesters: ${err.message}`)
      res.status(500).send({ message: err.message })
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
