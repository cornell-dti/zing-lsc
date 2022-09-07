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
}

const CourseContext = React.createContext<CourseContextType>({
  hasLoadedCourses: false,
  courses: [],
  moveStudent: () => {},
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
