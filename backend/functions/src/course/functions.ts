import { db } from '../config'
import { getStudentsData } from '../student/functions'
const courseRef = db.collection('courses')

async function getCourseInfo(courseId: string) {
  const snapshot = await courseRef.doc(courseId).get()
  if (!snapshot.exists) throw new Error("This course doesn't exist")
  const result: any = snapshot.data()
  result.latestSubmissionTime = result.latestSubmissionTime.toDate()
  return result
}

async function getAllCourses() {
  const snapshot = await courseRef.get()
  return snapshot.docs.map((doc) => {
    const obj = doc.data()
    obj.courseId = doc.id
    obj.latestSubmissionTime = obj.latestSubmissionTime.toDate()
    return obj
  })
}

async function getStudentsForCourse(courseId: string) {
  const courseSnapshot = await courseRef.doc(courseId).get()
  if (!courseSnapshot.exists)
    throw new Error(`Course ${courseId} does not exist`)
  const courseData: any = courseSnapshot.data()
  const unmatched = courseData.unmatched

  const groupsQueryDocSnapshots = (
    await courseSnapshot.ref.collection('groups').get()
  ).docs

  const data = groupsQueryDocSnapshots.map((snapshot) => snapshot.data())
  const unmatchedStudentData = await getStudentsData(unmatched)
  const groupStudentDataRaw = await Promise.all(
    data.map((group) => getStudentsData(group.members))
  )

  const groupStudentData = groupStudentDataRaw.map((groupData, index) => ({
    memberData: groupData,
    groupNumber: data[index].groupNumber,
    createTime: data[index].createTime.toDate(),
    updateTime: data[index].updateTime.toDate(),
    shareMatchEmailTimestamp: data[index].shareMatchEmailTimestamp
      ? data[index].shareMatchEmailTimestamp.toDate()
      : null,
    checkInEmailTimestamp: data[index].checkInEmailTimestamp
      ? data[index].checkInEmailTimestamp.toDate()
      : null,
    addStudentEmailTimestamp: data[index].addStudentEmailTimestamp
      ? data[index].addStudentEmailTimestamp.toDate()
      : null,
  }))

  return {
    unmatched: unmatchedStudentData,
    groups: groupStudentData,
  }
}

export { getCourseInfo, getAllCourses, getStudentsForCourse }
