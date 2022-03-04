require('dotenv').config({ path: '../.env' })
const { db } = require('../config')
const courseRef = db.collection('courses')
const studentRef = db.collection('students')

async function getStudent(email) {
  const snapshot = await studentRef.doc(email).get()
  if (!snapshot.exists) throw new Error(`Student ${email} does not exist`)
  const result = snapshot.data()
  result.email = email
  return result
}

async function getDataForStudents(emails) {
  return Promise.all(emails.map((email) => getStudent(email)))
}

async function getCourseInfo(courseId) {
  const snapshot = await courseRef.doc(courseId).get()
  if (!snapshot.exists) throw new Error("This course doesn't exist")
  return snapshot.data()
}

async function getAllCourses() {
  const snapshot = await courseRef.get()
  return snapshot.docs.map((doc) => {
    let obj = doc.data()
    obj.courseId = doc.id
    return obj
  })
}

async function getStudentsForCourse(courseId) {
  const courseSnapshot = await courseRef.doc(courseId).get()
  if (!courseSnapshot.exists)
    throw new Error(`Course ${courseId} does not exist`)
  const courseData = courseSnapshot.data()
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
  }))

  return {
    unmatched: unmatchedStudentData,
    groups: groupStudentData,
  }
}

module.exports = {
  getDataForStudents,
  getCourseInfo,
  getAllCourses,
  getStudentsForCourse,
}
