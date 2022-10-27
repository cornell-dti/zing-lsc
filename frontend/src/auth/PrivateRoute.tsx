import { Redirect, Route } from 'react-router'
import { ADMIN_PATH, SURVEY_PATH } from '@core/Constants'
import { useAuthValue } from './AuthContext'
import { RouteProps } from '@core'
import { RouteLoading } from './RouteLoading'
import { Box, Button, Container, Typography } from '@mui/material'
import { logOut } from '@fire'
import { useCourseValue } from '@context/CourseContext'
import { useStudentValue } from '@context/StudentContext'

export const PrivateRoute = ({
  component: Component,
  ...routeProps
}: RouteProps) => {
  const { authState } = useAuthValue()
  const { hasLoadedCourses } = useCourseValue()
  const { hasLoadedStudents } = useStudentValue()

  switch (authState) {
    case 'loading':
      return <RouteLoading isLoading={true} />
    // not logged in, redirect back to home page
    case 'unauthenticated':
      return (
        <Route
          {...routeProps}
          render={() => {
            return <Redirect to={ADMIN_PATH} />
          }}
        />
      )
    // unauthorized, so display message to user that you are unauthorized
    case 'unauthorized':
      return (
        <Route
          {...routeProps}
          render={() => {
            return <Redirect to={SURVEY_PATH} />
          }}
        />
      )
    // authorized, hooray, you can see the content!
    case 'authorized':
      return hasLoadedCourses && hasLoadedStudents ? (
        <Route
          {...routeProps}
          render={(props) => {
            return <Component {...props} />
          }}
        />
      ) : (
        <RouteLoading
          isLoading={true}
          hasLoadedCourses={hasLoadedCourses}
          hasLoadedStudents={hasLoadedStudents}
        />
      )
  }
}
