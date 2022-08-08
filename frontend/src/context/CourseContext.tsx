import React, { useContext } from 'react'
import { Course } from '@core/Types'

interface CourseContextType {
  courses: Course[]
}

const CourseContext = React.createContext<CourseContextType>({
  courses: [],
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
