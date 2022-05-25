import { GridSize } from '@mui/material'
import { Student } from './Student'

export interface UnmatchedGridProps {
  unmatchedStudents: Student[]
  moveStudent: (
    studentToMove: Student,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
  matchStudents: () => void
}

export interface GroupGridProps {
  studentList: Student[]
  groupNumber: number
  shareMatchEmailTimestamp: Date | null
  moveStudent: (
    studentToMove: Student,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
  createTime: Date
  updateTime: Date
  selected: boolean
  handleChecked: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface StudentGridProps {
  student: Student
  groupNumber: number
  xsSize?: GridSize
  submissionTime: Date
}

export interface MatchLoadingProps {
  showMatchLoading: boolean
  isCurrentlyGrouping: boolean
  numberGrouping: number
  courseNames: string[]
  setShowMatchLoading: (arg: boolean) => void
}

export interface EmailModalProps {
  isEmailing: boolean
  setIsEmailing: (arg: boolean) => void
}
