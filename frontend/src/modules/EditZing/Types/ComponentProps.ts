import { GridSize } from '@material-ui/core'
import { Group } from './CourseInfo'
import { Student } from './Student'

export interface UnmatchedGridProps {
  unmatchedStudents: Student[]
}

export interface GroupGridProps {
  studentList: Student[]
  groupNumber: number
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
