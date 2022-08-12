import { db } from '../config'
import { getStudentsData } from '../student/functions'
import { Course, FirestoreCourse, FirestoreGroup } from '../types'
const courseRef = db.collection('courses')

async function getCourseInfo(courseId: string) {
  const snapshot = await courseRef.doc(courseId).get()
  if (!snapshot.exists) throw new Error("This course doesn't exist")
  const result: any = snapshot.data()
  result.latestSubmissionTime = result.latestSubmissionTime.toDate()
  return result
}

export const getAllCourses = async (): Promise<Course[]> => {
  const courseCollection = await courseRef.get()
  return Promise.all(
    courseCollection.docs.map(async (courseDoc) => {
      const courseData = courseDoc.data() as FirestoreCourse
      return {
        ...courseData,
        courseId: courseDoc.id,
        latestSubmissionTime: courseData.latestSubmissionTime.toDate(),
        groups: (await courseDoc.ref.collection('groups').get()).docs
          .map((groupDoc) => groupDoc.data() as FirestoreGroup)
          .map((groupData) => ({
            ...groupData,
            createTime: groupData.createTime.toDate(),
            updateTime: groupData.updateTime.toDate(),
            addStudentEmailTimestamp:
              groupData.addStudentEmailTimestamp?.toDate() || null,
            checkInEmailTimestamp:
              groupData.checkInEmailTimestamp?.toDate() || null,
            shareMatchEmailTimestamp:
              groupData.shareMatchEmailTimestamp?.toDate() || null,
          })),
      }
    })
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

export { getCourseInfo, getStudentsForCourse }
