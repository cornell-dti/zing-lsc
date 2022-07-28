export interface Student {
  name: string
  email: string
  year: string
  college: string
  groups: GroupMembership[]
}

export interface GroupMembership {
  courseId: string
  groupNumber: number
  notes: string
  notesModifyTime: Date
  submissionTime: Date
}

export interface ResponseStudent {
  name: string
  email: string
  year: string
  college: string
  groups: ResponseGroupMembership[]
}

export interface ResponseGroupMembership {
  courseId: string
  groupNumber: number
  notes: string
  notesModifyTime: string
  submissionTime: string
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

export const responseStudentToStudent = (
  student: ResponseStudent
): Student => ({
  ...student,
  groups: student.groups.map((groupMembership) => ({
    ...groupMembership,
    // Remember to convert the notesModifyTime too
    notesModifyTime: new Date(groupMembership.notesModifyTime),
    submissionTime: new Date(groupMembership.submissionTime),
  })),
})
