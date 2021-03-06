import { ResponseStudent, Student } from './Student'

// This interface does not contain all of the fields that are returned
export interface CourseInfo {
  roster: string
  names: string[]
  unmatched: string[]
}

export interface Group {
  groupNumber: number
  memberData: Student[]
  createTime: Date
  updateTime: Date
  shareMatchEmailTimestamp: Date | null
  checkInEmailTimestamp: Date | null
  addStudentEmailTimestamp: Date | null
}

export interface ResponseGroup {
  groupNumber: number
  memberData: ResponseStudent[]
  createTime: string
  updateTime: string
  shareMatchEmailTimestamp: string | null
  checkInEmailTimestamp: string | null
  addStudentEmailTimestamp: string | null
}

export interface CourseInfoResponse {
  success: boolean
  data: CourseInfo
}

export interface CourseStudentDataResponse {
  success: boolean
  data: {
    unmatched: ResponseStudent[]
    groups: ResponseGroup[]
  }
}
