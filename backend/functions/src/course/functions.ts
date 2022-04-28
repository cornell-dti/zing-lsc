require('dotenv').config({ path: '../.env' })

import { db } from '../config'
const courseRef = db.collection('courses')
const studentRef = db.collection('students')

async function getStudent(email: string) {
  const snapshot = await studentRef.doc(email).get()
  if (!snapshot.exists) throw new Error(`Student ${email} does not exist`)
  const result: any = snapshot.data()
  result.email = email
  result.submissionTime = result.submissionTime.toDate()
  return result
}

async function getDataForStudents(emails: string[]) {
  return Promise.all(emails.map((email) => getStudent(email)))
}

async function getCourseInfo(courseId: any) {
  const snapshot = await courseRef.doc(courseId).get()
  if (!snapshot.exists) throw new Error("This course doesn't exist")
  return snapshot.data()
}

async function getAllCourses() {
  const snapshot = await courseRef.get()
  return snapshot.docs.map((doc) => {
    const obj = doc.data()
    obj.courseId = doc.id
    return obj
  })
}

async function getStudentsForCourse(courseId: any) {
  const courseSnapshot = await courseRef.doc(courseId).get()
  if (!courseSnapshot.exists)
    throw new Error(`Course ${courseId} does not exist`)
  const courseData: any = courseSnapshot.data()
  const unmatched = courseData.unmatched

  const groupsQueryDocSnapshots = (
    await courseSnapshot.ref.collection('groups').get()
  ).docs

  const data = groupsQueryDocSnapshots.map((snapshot) => snapshot.data())
  const unmatchedStudentData = await getDataForStudents(unmatched)
  const groupStudentDataRaw = await Promise.all(
    data.map((group) => getDataForStudents(group.members))
  )

  const groupStudentData = groupStudentDataRaw.map((groupData, index) => ({
    memberData: groupData,
    groupNumber: data[index].groupNumber,
    createTime: data[index].createTime.toDate(),
    updateTime: data[index].updateTime.toDate(),
  }))

  return {
    unmatched: unmatchedStudentData,
    groups: groupStudentData,
  }
}

export {
  getDataForStudents,
  getCourseInfo,
  getAllCourses,
  getStudentsForCourse,
}
