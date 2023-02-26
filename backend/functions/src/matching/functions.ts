import { db } from '../config'
import admin from 'firebase-admin'
import { FirestoreGroup, Group } from '../types'
const courseRef = db.collection('courses')
const studentRef = db.collection('students')
let groupId = 0
// =====================  HELPER FUNCTIONS ======================
/** Avoid using this assertion check, it's usually not necessary.
 *  Just get the course doc and throw an error if the data is undefined. */
async function assertIsExistingCourse(courseId: string) {
  await courseRef
    .doc(courseId)
    .get()
    .then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error(`Course ${courseId} does not exist`)
      }
    })
}

async function updateStudentReferencesForGroup(group: Group, courseId: string) {
  return group.members.map((member) =>
    updateStudentGroup(member, courseId, group.groupNumber)
  )
}

async function updateStudentGroup(
  studentEmail: string,
  courseId: string,
  groupNumber: number
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
async function makeMatches(courseId: string) {
  await assertIsExistingCourse(courseId)

  // get all unmatched students for course.
  const data: any = (await courseRef.doc(courseId).get()).data()
  const unmatchedEmails: string[] = data.unmatched
  const lastGroupNumber: number = data.lastGroupNumber

  // Zero students can't be matched
  if (unmatchedEmails.length === 0) {
    return { unmatched: [], groups: [] }
  }
  // One student can't be matched
  if (unmatchedEmails.length === 1) {
    return { unmatched: unmatchedEmails, groups: [] }
  }

  // Fairly naive group matching code but it's written for clarity
  let groupTriples: string[]
  let groupDoubles: string[]
  if (unmatchedEmails.length % 3 === 0) {
    groupTriples = unmatchedEmails
    groupDoubles = []
  } else if (unmatchedEmails.length % 3 === 1) {
    groupTriples = unmatchedEmails.slice(0, -4)
    groupDoubles = unmatchedEmails.slice(-4)
  } else {
    groupTriples = unmatchedEmails.slice(0, -2)
    groupDoubles = unmatchedEmails.slice(-2)
  }

  const nowTimestamp = admin.firestore.Timestamp.now()
  const nowDate = nowTimestamp.toDate()

  let groupCounter = 0
  const newGroups: Group[] = []
  for (let i = 0; i < groupTriples.length; i += 3) {
    groupCounter += 1
    groupId += 1
    const newGroup = groupTriples.slice(i, i + 3)
    newGroups.push({
      groupId: groupId,
      groupNumber: groupCounter + lastGroupNumber,
      members: newGroup,
      createTime: nowDate,
      updateTime: nowDate,
      templateTimestamps: {},
      hidden: false,
    })
  }
  for (let i = 0; i < groupDoubles.length; i += 2) {
    groupCounter += 1
    groupId += 1
    const newGroup = groupDoubles.slice(i, i + 2)
    newGroups.push({
      groupId: groupId,
      groupNumber: groupCounter + lastGroupNumber,
      members: newGroup,
      createTime: nowDate,
      updateTime: nowDate,
      templateTimestamps: {},
      hidden: false,
    })
  }

  // map for specific firebase data (native database timestamp format)
  const newGroupsFirestore: FirestoreGroup[] = newGroups.map((group) => ({
    ...group,
    createTime: nowTimestamp,
    updateTime: nowTimestamp,
    templateTimestamps: {}, // Groups have this typed differently though it's just empty object
    hidden: false,
  }))

  // lastly, update the collections to reflect this matching
  await Promise.all(
    [
      courseRef
        .doc(courseId)
        .update({
          unmatched: [],
          lastGroupNumber: lastGroupNumber + groupCounter,
        })
        .catch((err) => console.log(err)),
      newGroupsFirestore.map((group) =>
        courseRef
          .doc(courseId)
          .collection('groups')
          .doc(group.groupNumber.toString())
          .set(group)
          .catch((err) => console.log(err))
      ),
      newGroups.map((group) =>
        updateStudentReferencesForGroup(group, courseId)
      ),
    ].flat()
  )

  return { unmatched: [], groups: newGroups }
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
  groupNumber: number,
  studentEmail: string
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
  group1: number,
  group2: number,
  studentEmail: string
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
  groupNumber: number,
  studentEmail: string
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

  const studentRecordUpdate = updateStudentGroup(studentEmail, courseId, -1)

  await Promise.all([groupUpdate, unmatchedUpdate, studentRecordUpdate])
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
      templateTimestamps: {},
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

async function hideEmptyGroup(
  courseId: string,
  groupNumber: number,
  toHide: boolean
) {
  await assertIsExistingCourse(courseId)

  const groupToHide = courseRef
    .doc(courseId)
    .collection('groups')
    .doc(groupNumber.toString())
    .update({ hidden: toHide })
    .catch((err) => {
      console.log(err)
      throw new Error(`Error in removing group ${groupNumber}`)
    })

  await Promise.all([groupToHide])
}

export {
  makeMatches,
  getGroups,
  addUnmatchedStudentToGroup,
  transferStudentBetweenGroups,
  createEmptyGroup,
  unmatchStudent,
  hideEmptyGroup,
}
