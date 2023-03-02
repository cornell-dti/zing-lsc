import { Router } from 'express'
import { logger } from 'firebase-functions'
const router = Router()

import {
  makeMatches,
  getGroups,
  addUnmatchedStudentToGroup,
  transferStudentBetweenGroups,
  createEmptyGroup,
  unmatchStudent,
  hideEmptyGroup,
} from './functions'

router.post('/make', (req, res) => {
  const { courseId } = req.body
  makeMatches(courseId)
    .then((data) => {
      logger.info(`Made matched for course: ${courseId}`)
      res.status(200).json(data)
    })
    .catch((err) => {
      // Later add special checks for WHY the error happened like course doesn't exist -- that could be a HTTP 400
      logger.error(`Unexpected error making matches: ${err.message}`)
      res.status(500).json({ message: err.message })
    })
})

router.get('/:courseId', (req, res) => {
  const courseId = req.params.courseId
  getGroups(courseId)
    .then((data) => {
      logger.info(`Successfully attempted to get course info for ${courseId}`)
      res.status(200).json(data)
    })
    .catch((err) => {
      logger.error(`Failed attempt to get course info for ${courseId}`)
      console.log(err)
      res.status(400).json({ success: false, err: err.message })
    })
})

router.post('/transfer/unmatched', (req, res) => {
  const { courseId, studentEmail, groupNumber } = req.body
  addUnmatchedStudentToGroup(courseId, groupNumber, studentEmail)
    .then(() => {
      logger.info(
        `Added unmatched student ${studentEmail} in group number ${groupNumber} for course ${courseId}`
      )
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      logger.error(
        `Failed to add unmatched student ${studentEmail} in group number ${groupNumber} for course ${courseId}`
      )
      console.log(err)
      res.status(400).json({ success: false, err: err.message })
    })
})

router.post('/transfer/intergroup', (req, res) => {
  const { courseId, studentEmail, group1, group2 } = req.body
  transferStudentBetweenGroups(courseId, group1, group2, studentEmail)
    .then(() => {
      logger.info(
        `Transferred student ${studentEmail} from group number ${group1} to ${group2} for course ${courseId}`
      )
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      logger.error(
        `Failed to transfer student ${studentEmail} from group number ${group1} to ${group2} for course ${courseId}`
      )
      console.log(err)
      res.status(400).json({ success: false, err: err.message })
    })
})

router.post('/empty-group', (req, res) => {
  const courseId = req.body.courseId
  createEmptyGroup(courseId)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      console.log(err)
      res.status(400).json({ success: false, err: err.message })
    })
})

router.post('/transfer/unmatch', (req, res) => {
  const { courseId, studentEmail, groupNumber } = req.body
  unmatchStudent(courseId, groupNumber, studentEmail)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      console.log(err)
      res.status(400).json({ success: false, err: err.message })
    })
})

router.post('/hide-group', (req, res) => {
  const { courseId, groupNumber } = req.body
  hideEmptyGroup(courseId, groupNumber)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      console.log(err)
      res.status(400).json({ success: false, err: err.message })
    })
})

export default router
