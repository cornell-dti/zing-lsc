import React, { useContext } from 'react'
import { Student } from '@core/Types'

interface StudentContextType {
  hasLoadedStudents: boolean
  students: Student[]
  updateNotes: (
    studentEmail: string,
    courseId: string,
    notes: string
  ) => Promise<void>
  addStudentEmailTimestamp: (
    studentEmail: string,
    courseId: string,
    templateId: string,
    timestamp: Date
  ) => void
}

const StudentContext = React.createContext<StudentContextType>({
  hasLoadedStudents: false,
  students: [],
  updateNotes: async () => {},
  addStudentEmailTimestamp: () => {},
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
