// For now this exists in the backend folder only
// Future: become a cool monorepo and have shared types backend/frontend

/** Student data. This is not exactly how it's stored in the database, since
 *  email is the document ID but not actually in the doc. Don't write to db */
export type Student = {
  name: string
  email: string
  college: string
  year: string
  submissionTime: Date
  groups: GroupMembership[]
}

/** Student's membership in a course */
export type GroupMembership = {
  courseId: string
  groupNumber: number
}
