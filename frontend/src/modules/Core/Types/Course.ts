export interface Course {
  names: string[]
  roster: string
  courseNumber: string
  courseId: string // Computed as {roster}-{courseNumber}
  unmatched: string[]
  groups: Group[]
  lastGroupNumber: number
  latestSubmissionTime: Date
}

export interface Group {
  groupNumber: number
  members: string[]
  createTime: Date
  updateTime: Date
  // TODO replace the below with the new template timestamps
  addStudentEmailTimestamp: Date | null
  checkInEmailTimestamp: Date | null
  shareMatchEmailTimestamp: Date | null
}

export interface ResponseCourse {
  names: string[]
  roster: string
  courseNumber: string
  courseId: string // Computed as {roster}-{courseNumber}
  unmatched: string[]
  groups: ResponseGroup[]
  lastGroupNumber: number
  latestSubmissionTime: string
}

export interface ResponseGroup {
  groupNumber: number
  members: string[]
  createTime: string
  updateTime: string
  // TODO replace the below with the new template timestamps
  addStudentEmailTimestamp: string | null
  checkInEmailTimestamp: string | null
  shareMatchEmailTimestamp: string | null
}

// TODO update this with new email template timestamp stuff
export const responseCourseToCourse = (course: ResponseCourse): Course => ({
  ...course,
  latestSubmissionTime: new Date(course.latestSubmissionTime),
  groups: course.groups.map((group) => ({
    ...group,
    createTime: new Date(group.createTime),
    updateTime: new Date(group.updateTime),
    addStudentEmailTimestamp: group.addStudentEmailTimestamp
      ? new Date(group.createTime)
      : null,
    checkInEmailTimestamp: group.checkInEmailTimestamp
      ? new Date(group.createTime)
      : null,
    shareMatchEmailTimestamp: group.shareMatchEmailTimestamp
      ? new Date(group.shareMatchEmailTimestamp)
      : null,
  })),
})
