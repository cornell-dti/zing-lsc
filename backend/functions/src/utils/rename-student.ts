// This script has enough code in it that you might as well just make the endpoint
if (process.argv.length !== 4) {
  console.error(
    'Usage: ts-node rename-student.ts old@cornell.edu new@cornell.edu'
  )
  process.exit()
}

import { db } from '../config'

const courseRef = db.collection('courses')
const studentRef = db.collection('students')

/** Rename the student document to the new email address */
const moveStudentDoc = async (
  studentData: FirebaseFirestore.DocumentData,
  oldEmail: string,
  newEmail: string
) => {
  await Promise.all([
    studentRef.doc(newEmail).set(studentData),
    studentRef.doc(oldEmail).delete(),
  ])
}

/** Update the course document when the student is not yet matched */
const updateCourseDocUnmatched = async (
  courseId: string,
  oldEmail: string,
  newEmail: string
) => {
  const courseDoc = courseRef.doc(courseId)
  const courseData = (await courseDoc.get()).data()
  if (!courseData) {
    throw Error(`Missing course ${courseId} in db`)
  }

  await courseDoc.update({
    unmatched: courseData.unmatched.map((email: string) =>
      email === oldEmail ? newEmail : email
    ),
  })
}

/** Update the group document in the course doc when the student has been grouped already */
const updateCourseDocGrouped = async (
  courseId: string,
  groupNumber: number,
  oldEmail: string,
  newEmail: string
) => {
  const groupDoc = courseRef
    .doc(courseId)
    .collection('groups')
    .doc(groupNumber.toString())
  const groupData = (await groupDoc.get()).data()
  if (!groupData) {
    throw Error(`Missing group ${groupNumber} in course ${courseId} in db`)
  }

  await groupDoc.update({
    members: groupData.members.map((email: string) =>
      email === oldEmail ? newEmail : email
    ),
  })
}

/** Update course-related documents to use new student email address */
const updateCourseDocs = async (
  studentData: FirebaseFirestore.DocumentData,
  oldEmail: string,
  newEmail: string
) => {
  const groups: { courseId: string; groupNumber: number }[] = studentData.groups
  const groupPromises = groups.map(({ courseId, groupNumber }) =>
    groupNumber < 0
      ? updateCourseDocUnmatched(courseId, oldEmail, newEmail)
      : updateCourseDocGrouped(courseId, groupNumber, oldEmail, newEmail)
  )

  await Promise.all(groupPromises)
}

/** Rename student from old email to new email, student + course docs */
const renameStudent = async (oldEmail: string, newEmail: string) => {
  const studentData = (await studentRef.doc(oldEmail).get()).data()
  if (!studentData) {
    throw Error(`No student data found for ${oldEmail}`)
  }

  await Promise.all([
    moveStudentDoc(studentData, oldEmail, newEmail),
    updateCourseDocs(studentData, oldEmail, newEmail),
  ])
}

const oldEmail = process.argv[2]
const newEmail = process.argv[3]

renameStudent(oldEmail, newEmail)
  .then(() => console.log(`Successfully renamed ${oldEmail} to ${newEmail}`))
  .catch((e) =>
    console.error(`Failed to rename ${oldEmail} to ${newEmail}: ${e}`)
  )
