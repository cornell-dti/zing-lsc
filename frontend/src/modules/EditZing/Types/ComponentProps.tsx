import React from 'react'
import { Student } from './Student'

export interface GroupGridProps {
  studentList: Student[]
  /** for naming the group and maybe key?*/
  groupNumber: number
}

export interface StudentGridProps {
  student: Student
}
