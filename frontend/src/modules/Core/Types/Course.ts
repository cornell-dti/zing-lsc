import { responseTimestampsToDate } from './Student'

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
  templateTimestamps: { [key: string]: Date }
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
  templateTimestamps: { [key: string]: string }
}

// TODO update this with new email template timestamp stuff
export const responseCourseToCourse = (course: ResponseCourse): Course => ({
  ...course,
  latestSubmissionTime: new Date(course.latestSubmissionTime),
  groups: course.groups.map((group) => ({
    ...group,
    createTime: new Date(group.createTime),
    updateTime: new Date(group.updateTime),
    templateTimestamps: responseTimestampsToDate(group.templateTimestamps),
  })),
})
