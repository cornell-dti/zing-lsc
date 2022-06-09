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
} from './functions'

// should return
// {
//     unmatched: unmatchedStudentData,
//     groups: groupStudentData,
//   }; ?
router.post('/make', (req, res) => {
  const { courseId } = req.body
  makeMatches(courseId)
    .then((data) => {
      logger.info(`Made matched for course: ${courseId}`)
      res.status(200).json({ success: true, data })
    })
    .catch((err) => {
      logger.error(
        `Failed to make matches for course ${courseId}. Error: `,
        err
      )
      console.log(err)
      res.status(400).json({ success: false, err: err.message })
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

export default router
