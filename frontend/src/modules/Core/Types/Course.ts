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
  groupId: string
  groupNumber: number
  members: string[]
  createTime: Date
  updateTime: Date
  templateTimestamps: { [key: string]: Date }
  hidden: boolean
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
  groupId: string
  groupNumber: number
  members: string[]
  createTime: string
  updateTime: string
  templateTimestamps: { [key: string]: string }
  hidden: boolean
}

export const responseGroupToGroup = (group: ResponseGroup): Group => ({
  ...group,
  createTime: new Date(group.createTime),
  updateTime: new Date(group.updateTime),
  templateTimestamps: responseTimestampsToDate(group.templateTimestamps),
  hidden: group.hidden,
})

export const responseCourseToCourse = (course: ResponseCourse): Course => ({
  ...course,
  latestSubmissionTime: new Date(course.latestSubmissionTime),
  groups: course.groups.map(responseGroupToGroup),
})
