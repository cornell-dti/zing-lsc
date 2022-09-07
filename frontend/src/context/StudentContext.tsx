import React, { useContext } from 'react'
import { Student } from '@core/Types'

interface StudentContextType {
  hasLoadedStudents: boolean
  students: Student[]
}

const StudentContext = React.createContext<StudentContextType>({
  hasLoadedStudents: false,
  students: [],
} as StudentContextType)

export function StudentProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: StudentContextType
}) {
  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  )
}

export function useStudentValue() {
  return useContext(StudentContext)
}
