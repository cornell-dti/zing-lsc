import { db } from '../config'
import { getStudentsData } from '../student/functions'
import admin from 'firebase-admin'
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

/**
 * Helper function to convert all timestamps in a templateTimestamps object into Dates
 * @param obj the templateTimestamps object containing templateId : timestamp pairs
 * @returns obj with all timestamps converted into Date objects
 */
function mapDate(obj: { [key: string]: admin.firestore.Timestamp }) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v.toDate()])
  )
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

  const a = groupStudentDataRaw.flat(1).map((student) => student.groups)
  console.log(a)

  const groupStudentData = groupStudentDataRaw.map((groupData, index) => ({
    memberData: groupData,
    groupNumber: data[index].groupNumber,
    createTime: data[index].createTime.toDate(),
    updateTime: data[index].updateTime.toDate(),
    templateTimestamps: mapDate(data[index].templateTimestamps),
  }))

  return {
    unmatched: unmatchedStudentData,
    groups: groupStudentData,
  }
}

export { getCourseInfo, getAllCourses, getStudentsForCourse }
