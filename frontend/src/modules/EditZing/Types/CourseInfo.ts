import { Student } from './Student'

export interface CourseInfo {
  names: string[]
  unmatched: string[]
}

export type Group = {
  groupNumber: number
  memberData: Student[]
  createTime: Date
  updateTime: Date
  shareMatchEmailTimestamp: Date | null
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
