import { GridSize } from '@material-ui/core'
import { Group } from './CourseInfo'
import { Student } from './Student'

export interface UnmatchedGridProps {
  unmatchedStudents: string[]
}

export interface GroupGridProps {
  // studentList: Group
  studentList: string[]
  groupNumber: number
  moveStudent: (
    // studentToMove: Student,
    student: string,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
}

export interface StudentGridProps {
  // student: Student
  student: string
  groupNumber: number
  xsSize?: GridSize
}
