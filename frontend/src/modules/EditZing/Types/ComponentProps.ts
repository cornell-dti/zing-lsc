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
}

export interface StudentGridProps {
  student: Student
  groupNumber: number
  xsSize?: GridSize
}

export interface MatchLoadingProps {
  showMatchLoading: boolean
  isCurrentlyGrouping: boolean
  numberGrouping: number
  courseNames: string[]
  setShowMatchLoading: (arg: boolean) => void
}
