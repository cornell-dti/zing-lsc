import { Router } from 'express'
import { config } from 'dotenv'
import { getCourseInfo, getAllCourses, getStudentsForCourse } from './functions'

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
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
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

export default router
