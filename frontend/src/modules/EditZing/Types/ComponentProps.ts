import { Student } from './Student'

export interface GroupGridProps {
  studentList: Student[]
  /** for naming the group and maybe key?*/
  groupIndex: number
  moveStudentBetweenGrids: (
    studentToMove: Student,
    startingIndex: number,
    destinationIndex: number
  ) => void
  moveStudentWithinGrid: (
    studentToMove: Student,
    currentGroupIndex: number,
    destinationStudentIndex: number
  ) => void
}

export interface StudentGridProps {
  student: Student
  /** index of the group/grid in the outermost array */
  groupIndex: number
  /** index of the student in the inner array */
  studentIndex: number
  moveStudentWithinGrid: (
    studentToMove: Student,
    currentGroupIndex: number,
    destinationStudentIndex: number
  ) => void
}
