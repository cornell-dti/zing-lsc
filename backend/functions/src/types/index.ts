import admin from 'firebase-admin'

type Timestamp = admin.firestore.Timestamp

// For now this exists in the backend folder only
// Future: become a cool monorepo and have shared types backend/frontend

/** Course */
export type Course = {
  names: string[]
  roster: string
  courseNumber: string
  courseId: string // Computed as {roster}-{courseNumber}
  unmatched: string[]
  groups: Group[]
  lastGroupNumber: number
  latestSubmissionTime: Date
}

/** Group of students in a class */
export type Group = {
  groupNumber: number
  members: string[]
  createTime: Date
  updateTime: Date
  // TODO replace the below with the new template timestamps
  addStudentEmailTimestamp: Date | null
  checkInEmailTimestamp: Date | null
  shareMatchEmailTimestamp: Date | null
}

/** Student data. This is not exactly how it's stored in the database, since
 *  email is the document ID but not actually in the doc. Don't write to db */
export type Student = {
  name: string
  email: string
  college: string
  year: string
  groups: GroupMembership[]
}

/** Student's membership in a course */
export type GroupMembership = {
  courseId: string
  groupNumber: number
  notes: string
  notesModifyTime: Date
  submissionTime: Date
}

/** Information about an email template */
export type EmailTemplate = {
  id: string
  name: string
  type: 'group' | 'student'
  subject: string
  body: string
  modifyTime: Date
}

/** How courses are stored in the database */
export type FirestoreCourse = {
  names: string[]
  roster: string
  courseNumber: string
  unmatched: string[]
  lastGroupNumber: number
  latestSubmissionTime: Timestamp
}

/** How groups are stored in the database */
export type FirestoreGroup = {
  groupNumber: number
  members: string[]
  createTime: Timestamp
  updateTime: Timestamp
  // TODO replace the below with the new template timestamps
  addStudentEmailTimestamp: Timestamp | null
  checkInEmailTimestamp: Timestamp | null
  shareMatchEmailTimestamp: Timestamp | null
}

/** How student data is stored in the database */
export type FirestoreStudent = {
  name: string
  college: string
  year: string
  groups: FirestoreGroupMembership[]
}

/** How group membership for students is stored in the database */
export type FirestoreGroupMembership = {
  courseId: string
  groupNumber: number
  notes: string
  notesModifyTime: Timestamp
  submissionTime: Timestamp
  firstNoMatchEmailTime: Timestamp
}

/** How email template data is stored in the database */
export type FirestoreEmailTemplate = {
  id: string
  name: string
  type: 'group' | 'student'
  subject: string
  body: string
  modifyTime: Timestamp
}
