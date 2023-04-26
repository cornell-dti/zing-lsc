import React, { useContext } from 'react'
import { Course } from '@core/Types'

interface CourseContextType {
  hasLoadedCourses: boolean
  courses: Course[]
  moveStudent: (
    studentEmail: string,
    courseId: string,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
  matchStudents: (courseId: string) => Promise<void>
  addGroupEmailTimestamps: (
    groupNumbers: number[],
    courseId: string,
    templateId: string,
    timestamp: Date
  ) => void
  removeGroups: (courseId: string, groupNumber: number, toHide: boolean) => void
  updateFlagged: (courseId: string, flagged: boolean) => void
}

const CourseContext = React.createContext<CourseContextType>({
  hasLoadedCourses: false,
  courses: [],
  moveStudent: () => {},
  matchStudents: async () => {},
  addGroupEmailTimestamps: () => {},
  removeGroups: () => {},
  updateFlagged: () => {},
} as CourseContextType)

export function CourseProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: CourseContextType
}) {
  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  )
}

export function useCourseValue() {
  return useContext(CourseContext)
}
