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

export const responseStudentToStudent = (
  student: ResponseStudent
): Student => ({
  ...student,
  groups: student.groups.map((groupMembership) => ({
    ...groupMembership,
    notesModifyTime: new Date(groupMembership.notesModifyTime),
    submissionTime: new Date(groupMembership.submissionTime),
  })),
})
