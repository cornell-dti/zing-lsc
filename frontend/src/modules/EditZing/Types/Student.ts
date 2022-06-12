export type Student = {
  name: string
  email: string
  year: string
  college: string
  submissionTime: Date
  groups: GroupMembership[]
}

export type GroupMembership = {
  courseId: string
  groupNumber: number
}

/** item type for drag and drop prop transfer via dnd */
export type DnDStudentTransferType = {
  type: string
  studentToMove: Student
  groupNumber: number
}

/** special type for reactdnd to keep track of what items are movable. in
 * this case, this is a movable student type
 */
export const STUDENT_TYPE = 'Student'
