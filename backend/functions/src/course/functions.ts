import { db } from '../config'
import { getStudentsData } from '../student/functions'
import admin from 'firebase-admin'
import { Course, FirestoreCourse, FirestoreGroup, Semester } from '../types'
const courseRef = db.collection('courses')
const semesterRef = db.collection('utils').doc('semester')

export const getCurrentSemester = async (): Promise<String> => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.currentSemester
}

export const setCurrentSemester = async (sem: String) => {
  const semData = (await semesterRef.get()).data() as Semester
  return semesterRef.set({
    ...semData,
    currentSemester: sem,
    surveyOpen: false,
  })
}

export const getAllSemesters = async () => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.allSemesters
}

export const getSurveyStatus = async () => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.surveyOpen
}

export const setSurveyStatus = async (status: Boolean) => {
  const semData = (await semesterRef.get()).data() as Semester
  return semesterRef.set({ ...semData, surveyOpen: status })
}

async function getCourseInfo(courseId: string) {
  const snapshot = await courseRef.doc(courseId).get()
  if (!snapshot.exists) throw new Error("This course doesn't exist")
  const result: FirebaseFirestore.DocumentData = snapshot.data() || {}
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
            groupId: groupData.groupId,
            createTime: groupData.createTime.toDate(),
            updateTime: groupData.updateTime.toDate(),
            templateTimestamps: mapDate(groupData.templateTimestamps),
            hidden: groupData.hidden,
          })),
      }
    })
  )
}

/**
 * Helper function to convert all timestamps in a templateTimestamps object into Dates
 * @param obj the templateTimestamps object containing templateId : timestamp pairs
 * @returns obj with all timestamps converted into Date objects
 */
export function mapDate(obj: { [key: string]: admin.firestore.Timestamp }) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v.toDate()])
  )
}

async function getStudentsForCourse(courseId: string) {
  const courseSnapshot = await courseRef.doc(courseId).get()
  if (!courseSnapshot.exists)
    throw new Error(`Course ${courseId} does not exist`)
  const courseData: FirebaseFirestore.DocumentData = courseSnapshot.data() || {}
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
    templateTimestamps: mapDate(data[index].templateTimestamps),
  }))

  return {
    unmatched: unmatchedStudentData,
    groups: groupStudentData,
  }
}

export { getCourseInfo, getStudentsForCourse }
