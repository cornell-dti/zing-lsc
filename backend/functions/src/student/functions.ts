import { db } from '../config'
import admin from 'firebase-admin'
import { logger } from 'firebase-functions'
import {
  mapCatalogNameToCourseId,
  MissingCourseError,
} from '../course/get_course_id'
import { mapDate } from '../course/functions'
import { FirestoreStudent, Student } from '../types'
import { getCurrentSemester } from '../settings/functions'
const courseRef = db.collection('courses')
const studentRef = db.collection('students')

/** Get all students in the student collection */
export const getAllStudents = async (): Promise<Student[]> => {
  const studentCollection = await studentRef.get()
  return studentCollection.docs.map((studentDoc) => {
    const email = studentDoc.id
    const studentData = studentDoc.data() as FirestoreStudent
    return {
      ...studentData,
      email,
      groups: studentData.groups.map((group) => ({
        ...group,
        notesModifyTime: group.notesModifyTime.toDate(),
        submissionTime: group.submissionTime.toDate(),
        templateTimestamps: mapDate(group.templateTimestamps),
      })),
    }
  })
}

/** Get student data as Student type (with email and timestamps as Date) */
export const getStudentData = async (email: string): Promise<Student> => {
  const studentDoc = await studentRef.doc(email).get()
  if (!studentDoc.exists) {
    throw new Error(`Student document for ${email} does not exist`)
  }
  const studentData = studentDoc.data() as FirestoreStudent
  return {
    ...studentData,
    email,
    groups: studentData.groups.map((group) => ({
      ...group,
      notesModifyTime: group.notesModifyTime.toDate(),
      submissionTime: group.submissionTime.toDate(),
      templateTimestamps: mapDate(group.templateTimestamps),
    })),
  }
}

/** Get multiple student data as Student type (email + timestamps as Date) */
export const getStudentsData = (emails: string[]) =>
  Promise.all(emails.map((email) => getStudentData(email)))

async function removeStudentFromCourse(
  email: string,
  courseId: string,
  groupNumber: number
) {
  //remove unmatched student
  if (groupNumber === -1) {
    const ref = courseRef.doc(courseId)

    return ref
      .update({
        unmatched: admin.firestore.FieldValue.arrayRemove(email),
      })
      .catch((err) => {
        logger.error(` error in removing ${email} from unmatched: ${err} `)
        throw new Error(`error in removing ${email} from unmatched.`)
      })
  }

  //remove matched student
  const ref = courseRef
    .doc(courseId)
    .collection('groups')
    .doc(groupNumber.toString())
  const data: FirebaseFirestore.DocumentData = (await ref.get()).data() || {}
  if (data.members.length === 1 && data.members.includes(email)) {
    //second condition is a sanity check
    return ref.delete() // Fix this if we ever use this function, I don't think they want groups to ever be deleted fully
  } else {
    return ref
      .update({
        members: admin.firestore.FieldValue.arrayRemove(email),
        updateTime: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch((err) => {
        console.log(err)
        throw new Error(`error in removing ${email} from group ${groupNumber}.`)
      })
  }
}

// Note: the error handling in this file is done the way it is so it is easier
// to decide response codes based on error type.
// NOTE: this function WILL succeed even if no classes could be found.
export const addStudentSurveyResponse = async (
  name: string,
  email: string,
  college: string,
  year: string,
  courseCatalogNames: string[],
  surveySubmittable: boolean
) => {
  const roster = await getCurrentSemester()

  if (!surveySubmittable) {
    throw new Error('Survey is Closed')
  }

  // 0. Check if email is valid cornell.edu email.
  const emailRegex = /^\w+@cornell.edu$/
  // if true => valid email. if false => invalid email.
  const validEmail = emailRegex.test(email)
  if (!validEmail) {
    throw new Error('Invalid Email Form')
  }

  // Find the courseId of all requested courses in survey
  const courseSettledPromises = await Promise.allSettled(
    courseCatalogNames.map(async (name) => ({
      catalogName: name,
      courseId: await mapCatalogNameToCourseId(name, roster),
    }))
  )

  // These courses were found successfully
  const courseIdsWithName = courseSettledPromises
    .filter((result) => result.status === 'fulfilled')
    .map(
      (
        result // This looks complicated but it's just Prettier aggressively formatting
      ) =>
        (
          result as PromiseFulfilledResult<{
            courseId: string
            catalogName: string
          }>
        ).value
    )

  // If there were errors finding courses, this is not empty
  const settledErrors: Error[] = courseSettledPromises
    .filter((result) => result.status === 'rejected')
    .map((result) => (result as PromiseRejectedResult).reason)
  // Re-throw error if it is not related to being unable to find a course
  const unexpectedError = settledErrors.find(
    (error) => error.name !== 'MissingCourseError'
  )
  if (unexpectedError) {
    throw unexpectedError
  }
  const missingCourseErrors = settledErrors as MissingCourseError[]

  // Make array of courseIds associated with their catalogNames (e.g. ['INFO 2040', 'CS 2850'])
  const courseIdsWithNames: { courseId: string; catalogNames: string[] }[] = []
  courseIdsWithName.forEach((course) => {
    const existing = courseIdsWithNames.find(
      (existing) => existing.courseId === course.courseId
    )
    if (existing) {
      existing.catalogNames.push(course.catalogName)
    } else {
      courseIdsWithNames.push({
        courseId: course.courseId,
        catalogNames: [course.catalogName],
      })
    }
  })

  // Find the existing courses this student is already in by checking group membership
  const existingData = (await studentRef.doc(email).get()).data() //gets all the existing data
  //studentCrses becomes courseIds of existingData.groups if available, otherwise []
  const existingCourses = existingData
    ? existingData.groups.filter(
        (course: { courseId: string; archived: string }) =>
          !course.archived ||
          !courseIdsWithNames
            .map((course) => course.courseId)
            .includes(course.courseId)
      )
    : [] //gets the existing courses
  const existingCourseIds: string[] = existingCourses.map(
    (course: { courseId: string }) => course.courseId
  )

  // Filter to the new courses to add
  const newCourseIdsWithNames = courseIdsWithNames.filter(
    (course) => !existingCourseIds.includes(course.courseId)
  )

  // Can't use serverTimestamp in arrays (error), but want to have same timestamp for everything here
  const surveyTimestamp = admin.firestore.Timestamp.now()

  // Map to group membership objects for the student
  const newCourses = newCourseIdsWithNames.map((course) => ({
    courseId: course.courseId,
    groupNumber: -1,
    notes: '',
    notesModifyTime: surveyTimestamp, // Can't use serverTimestamp in arrays...
    submissionTime: surveyTimestamp,
    templateTimestamps: {},
    archived: false,
    flagged: false,
  }))

  // First, update the [student] collection to include the data for the new student
  const studentUpdate = studentRef
    .doc(email)
    .set({
      name,
      college,
      year,
      groups: [...existingCourses, ...newCourses],
    })
    .catch((err) => {
      console.log(err)
      const e = new Error(`Error in processing studentUpdate for ${email}`)
      e.name = 'processing_err'
      throw e
    })

  // Next, update each course record to add this student
  const courseUpdates = newCourseIdsWithNames.map((course) =>
    courseRef
      .doc(course.courseId) // We want the courseID to allow for crosslisting
      .get()
      .then((snapshot) => {
        // create a record for this course if it doesn't exist already.
        if (!snapshot.exists) {
          return snapshot.ref
            .set({
              roster,
              courseNumber: course.courseId.replace(`${roster}-`, ''),
              unmatched: [],
              names: course.catalogNames,
              lastGroupNumber: 0,
              flagged: false,
            })
            .then(() => snapshot.ref)
            .catch((err) => {
              console.log(err)
              const e = new Error(
                `Error in creating course in courseUpdate for course ${course.catalogNames}`
              )
              e.name = 'processing_err'
              throw e
            })
        } else {
          // update record for this course, if it exists
          snapshot.ref
            .update({
              flagged: false,
              names: admin.firestore.FieldValue.arrayUnion(
                ...course.catalogNames
              ),
            })
            .catch((err) => {
              console.log(err)
              const e = new Error(
                `Error in updating course in courseUpdate for course ${course.catalogNames}`
              )
              e.name = 'processing_err'
              throw e
            })
        }
        return snapshot.ref
      })
      .then((snapshotRef) =>
        snapshotRef
          .update({
            unmatched: admin.firestore.FieldValue.arrayUnion(email),
            latestSubmissionTime: surveyTimestamp,
            flagged: false,
          })
          .catch((err) => {
            console.log(err)
            const e = new Error(
              `Error in updating data for student ${email} in course ${course.catalogNames}`
            )
            e.name = 'processing_err'
            throw e
          })
      )
  )

  const allUpdates = [...courseUpdates, studentUpdate]
  await Promise.all(allUpdates)

  // Return which course names were added and which weren't (couldn't be found)
  const added = newCourseIdsWithNames.map((course) =>
    course.catalogNames.join('/')
  )
  const failed = missingCourseErrors.map((error) => error.courseCatalogName)
  logger.info(
    `Added student [${email}] to [${added.join(
      ', '
    )}]. Missing courses: [${failed.join(', ')}] in ${roster}`
  )

  return { added, failed, roster }
}
interface group {
  courseId: string
  groupNumber: number
}

// This has not been used in a very long long time
export async function removeStudent(email: string) {
  const studentDocRef = studentRef.doc(email)
  const data = (await studentDocRef.get()).data()
  if (!data) throw new Error(`Cannot find student ${email}`)
  const groups = data.groups
  const courseUpdates = groups.map(({ courseId, groupNumber }: group) =>
    groupNumber !== -1
      ? removeStudentFromCourse(email, courseId, groupNumber)
      : undefined
  )
  await Promise.all([courseUpdates, studentDocRef.delete()].flat())
}

/** Update student notes for a specific course */
export const updateStudentNotes = async (
  email: string,
  courseId: string,
  notes: string
) => {
  const studentDocRef = studentRef.doc(email)
  const studentDoc = await studentDocRef.get()
  if (!studentDoc.exists) {
    throw new Error(`Student document for ${email} does not exist`)
  }
  const studentData = studentDoc.data() as FirestoreStudent

  const groups = studentData.groups
  const groupMembership = groups.find((group) => group.courseId === courseId)
  if (!groupMembership) {
    throw new Error(`Student ${email} does not have membership in ${courseId}`)
  }

  groupMembership.notes = notes
  groupMembership.notesModifyTime = admin.firestore.Timestamp.now()

  await studentDocRef.update({ groups })
  logger.info(
    `Updated notes for [${courseId}] in student [${email}] to [${notes}]`
  )
}

async function archiveStudentInStudent(email: string, courseId: string) {
  const studentDocRef = studentRef.doc(email)
  const studentDoc = await studentDocRef.get()
  if (!studentDoc.exists) {
    throw new Error(`Student document for ${email} does not exist`)
  }
  const studentData = studentDoc.data() as FirestoreStudent
  const groups = studentData.groups
  const groupMembership = groups.find((group) => group.courseId === courseId)
  if (!groupMembership) {
    throw new Error(`Student ${email} does not have membership in ${courseId}`)
  }

  groupMembership.archived = true
  await studentDocRef.update({ groups })
  logger.info(`Archived [${courseId}] in student [${email}]]`)
  return groupMembership.groupNumber
}

export async function archiveStudent(email: string, courseId: string) {
  const groupNum = await archiveStudentInStudent(email, courseId)
  await removeStudentFromCourse(email, courseId, groupNum)
}
