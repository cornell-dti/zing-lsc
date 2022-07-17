import admin from 'firebase-admin'

type Timestamp = admin.firestore.Timestamp

// For now this exists in the backend folder only
// Future: become a cool monorepo and have shared types backend/frontend

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
  firstNoMatchEmailTimestamp: Timestamp
}
