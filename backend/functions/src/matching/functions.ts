import { db } from '../config'
import admin from 'firebase-admin'
import { getDataForStudents } from '../course/functions'
const courseRef = db.collection('courses')
const studentRef = db.collection('students')

// =====================  HELPER FUNCTIONS ======================
async function assertIsExistingCourse(courseId: any) {
  await courseRef
    .doc(courseId)
    .get()
    .then((snapshot: any) => {
      if (!snapshot.exists) {
        throw new Error(`Course ${courseId} does not exist`)
      }
    })
}

async function updateStudentReferencesForGroup(
  group: {
    groupNumber: any
    members: any
    createTime?: FirebaseFirestore.FieldValue
    updateTime?: FirebaseFirestore.FieldValue
  },
  courseId: any
) {
  return group.members.map((member: any) =>
    updateStudentGroup(member, courseId, group.groupNumber)
  )
}

async function updateStudentGroup(
  studentEmail: string,
  courseId: any,
  groupNumber: any
) {
  return studentRef
    .doc(studentEmail)
    .get()
    .then((snapshot) => {
      const data: any = snapshot.data()
      const groups = data.groups
      for (const obj of groups) {
        if (obj.courseId === courseId) {
          obj.groupNumber = groupNumber
          break
        }
      }
      return [snapshot.ref, groups]
    })
    .then(([ref, groups]) =>
      ref.update({
        groups,
      })
    )
    .catch((err) => console.log(err))
}

// =============================== EXPORTS ==================================
async function makeMatches(courseId: string, groupSize = 3) {
  await assertIsExistingCourse(courseId)

  // get all unmatched students for course.
  const data: any = (await courseRef.doc(courseId).get()).data()
  const unmatchedStudents = data.unmatched
  const lastGroupNumber = data.lastGroupNumber

  // get relevant student data to get preferred working times
  const studentData = await Promise.all(
    unmatchedStudents.map((studentEmail: string) =>
      studentRef
        .doc(studentEmail)
        .get()
        .then((snapshot) => {
          if (!snapshot.exists)
            throw new Error(`Student ${studentEmail} does not exist`)
          const d: any = snapshot.data()
          d['email'] = snapshot.id
          return d
        })
        .catch((err) => {
          console.log(err)
          throw new Error(`Error in getting data for ${studentEmail}`)
        })
    )
  )
  studentData.sort(
    (obj1, obj2) => obj1.preferredWorkingTime - obj2.preferredWorkingTime
  )

  // greedily form groups. THESE MAY NOT BE PERFECT.
  let i = 0
  let groupCounter = 0
  const groups = []
  // we won't match students who don't form a full group
  const studentDataSliced = studentData.slice(
    0,
    -(studentData.length % groupSize) || undefined //extend to the end of the array if we have perfect groups
  )
  while (i < studentDataSliced.length) {
    const nextGroup = studentDataSliced.slice(i, i + groupSize)
    groups.push({
      groupNumber: groupCounter + lastGroupNumber,
      memberData: nextGroup, // this is to keep things consistent
    })
    i += nextGroup.length
    groupCounter += 1
  }
  const matchedStudentSet = new Set(studentDataSliced.map((s) => s.email))
  const unmatched = unmatchedStudents.filter(
    (s: any) => !matchedStudentSet.has(s)
  )

  // map for specific firebase data (just emails, as preserved from the previous function)
  const groupsWithMembersEmail = groups.map((group) => ({
    groupNumber: group.groupNumber,
    members: group.memberData.map((member) => member.email),
    createTime: admin.firestore.FieldValue.serverTimestamp(),
    updateTime: admin.firestore.FieldValue.serverTimestamp(),
  }))

  // lastly, update the collections to reflect this matching
  await Promise.all(
    [
      courseRef
        .doc(courseId)
        .update({
          unmatched,
          lastGroupNumber: lastGroupNumber + groupsWithMembersEmail.length,
        })
        .catch((err) => console.log(err)),
      groupsWithMembersEmail.map((group) =>
        courseRef
          .doc(courseId)
          .collection('groups')
          .doc(group.groupNumber.toString())
          .set(group, { merge: true })
          .catch((err) => console.log(err))
      ),
      groupsWithMembersEmail.map((group) =>
        updateStudentReferencesForGroup(group, courseId)
      ),
    ].flat()
  )

  // map this to student objects
  const unmatchedAsStudents = await getDataForStudents(unmatched)

  return {
    unmatched: unmatchedAsStudents,
    groups: groups,
  }
}

async function getGroups(courseId: string) {
  await assertIsExistingCourse(courseId)
  const querySnapshotDocs = await courseRef
    .doc(courseId)
    .collection('groups')
    .get()
  const docData = querySnapshotDocs.docs.map((doc) => doc.data())
  return docData
}

// transfer student from the list of unmatched students to a group
async function addUnmatchedStudentToGroup(
  courseId: string,
  groupNumber: { toString: () => string },
  studentEmail: any
) {
  await assertIsExistingCourse(courseId)

  const courseData: any = (await courseRef.doc(courseId).get()).data()
  let unmatched = courseData.unmatched

  if (!unmatched.includes(studentEmail))
    throw new Error('This student is not currently unmatched')

  const groupSnapshot = await courseRef
    .doc(courseId)
    .collection('groups')
    .doc(groupNumber.toString())
    .get()

  if (!groupSnapshot.exists) throw new Error('Invalid group provided.')

  unmatched = unmatched.filter((u: any) => u !== studentEmail)

  await Promise.all([
    courseRef
      .doc(courseId)
      .update({ unmatched })
      .catch((err) => console.log(err)),

    groupSnapshot.ref
      .update({
        members: admin.firestore.FieldValue.arrayUnion(studentEmail),
        updateTime: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch((err) => console.log(err)),

    updateStudentGroup(studentEmail, courseId, groupNumber),
  ])
}

// transfer student from group1 to group2
async function transferStudentBetweenGroups(
  courseId: string,
  group1: string,
  group2: string,
  studentEmail: any
) {
  await assertIsExistingCourse(courseId)

  // make sure student 1 is indeed in group1
  const group1Data: any = (
    await courseRef
      .doc(courseId)
      .collection('groups')
      .doc(group1.toString())
      .get()
  ).data()

  if (!group1Data.members.includes(studentEmail))
    throw new Error(
      `The student ${studentEmail} doesn't exist in group${group1}`
    )

  const group1Update = courseRef
    .doc(courseId)
    .collection('groups')
    .doc(group1.toString())
    .update({
      members: admin.firestore.FieldValue.arrayRemove(studentEmail),
      updateTime: admin.firestore.FieldValue.serverTimestamp(),
    })
    .catch((err) => {
      console.log(err)
      throw new Error(`error in removing ${studentEmail} from group${group1}.`)
    })

  const group2Update = courseRef
    .doc(courseId)
    .collection('groups')
    .doc(group2.toString())
    .update({
      members: admin.firestore.FieldValue.arrayUnion(studentEmail),
      updateTime: admin.firestore.FieldValue.serverTimestamp(),
    })
    .catch((err) => {
      console.log(err)
      throw new Error(`error in adding ${studentEmail} from group${group2}.`)
    })

  const studentRecordUpdate = updateStudentGroup(studentEmail, courseId, group2)

  await Promise.all([group1Update, group2Update, studentRecordUpdate])
}

// transfer student from group to unmatched students
async function unmatchStudent(
  courseId: string,
  groupNumber: { toString: () => string },
  studentEmail: any
) {
  await assertIsExistingCourse(courseId)

  const groupUpdate = courseRef
    .doc(courseId)
    .collection('groups')
    .doc(groupNumber.toString())
    .update({
      members: admin.firestore.FieldValue.arrayRemove(studentEmail),
      updateTime: admin.firestore.FieldValue.serverTimestamp(),
    })
    .catch((err) => {
      console.log(err)
      throw new Error(
        `error in removing ${studentEmail} from group${groupNumber}.`
      )
    })

  const unmatchedUpdate = courseRef
    .doc(courseId)
    .update({ unmatched: admin.firestore.FieldValue.arrayUnion(studentEmail) })
    .catch((err) => {
      console.log(err)
      throw new Error(`error in adding ${studentEmail} to unmatched students.`)
    })

  await Promise.all([groupUpdate, unmatchedUpdate])
}

async function createEmptyGroup(courseId: string) {
  await assertIsExistingCourse(courseId)
  const data: any = (await courseRef.doc(courseId).get()).data()
  const lastGroupNumber = data.lastGroupNumber

  const groupCreationUpdate = courseRef
    .doc(courseId)
    .collection('groups')
    .doc(lastGroupNumber.toString())
    .set({
      groupNumber: lastGroupNumber,
      members: [],
      createTime: admin.firestore.FieldValue.serverTimestamp(),
      updateTime: admin.firestore.FieldValue.serverTimestamp(),
    })
    .catch((err) => {
      console.log(err)
      throw new Error(`Error in creating empty group for ${courseId}`)
    })

  const groupNumberUpdate = courseRef
    .doc(courseId)
    .update({ lastGroupNumber: lastGroupNumber + 1 })
    .catch((err) => {
      console.log(err)
      throw new Error(`Error in creating empty group for ${courseId}`)
    })

  await Promise.all([groupCreationUpdate, groupNumberUpdate])
}

export {
  makeMatches,
  getGroups,
  addUnmatchedStudentToGroup,
  transferStudentBetweenGroups,
  createEmptyGroup,
  unmatchStudent,
}
