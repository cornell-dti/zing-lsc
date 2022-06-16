import { Student } from './Student'

// This interface does not contain all of the fields that are returned
export interface CourseInfo {
  roster: string
  names: string[]
  unmatched: string[]
}

export type Group = {
  groupNumber: number
  memberData: Student[]
  createTime: Date
  updateTime: Date
  shareMatchEmailTimestamp: Date | null
  checkInEmailTimestamp: Date | null
  addStudentEmailTimestamp: Date | null
}

export interface CourseInfoResponse {
  success: boolean
  data: CourseInfo
}

export interface CourseStudentDataResponse {
  success: boolean
  data: {
    unmatched: Student[]
    groups: Group[]
  }
}
