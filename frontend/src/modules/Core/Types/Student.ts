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
  templateTimestamps: { [key: string]: Date }
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
  templateTimestamps: { [key: string]: string }
}

export const responseTimestampsToDate = (timestamp: {
  [key: string]: string
}) => {
  return Object.fromEntries(
    Object.entries(timestamp).map(([k, v]) => [k, new Date(v)])
  )
}

export const responseStudentToStudent = (student: ResponseStudent): Student => {
  return {
    ...student,
    groups: student.groups.map((groupMembership) => ({
      ...groupMembership,
      // Remember to convert the notesModifyTime too
      notesModifyTime: new Date(groupMembership.notesModifyTime),
      submissionTime: new Date(groupMembership.submissionTime),
      templateTimestamps: responseTimestampsToDate(
        groupMembership.templateTimestamps
      ),
    })),
  }
}
