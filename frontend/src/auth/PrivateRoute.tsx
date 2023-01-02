import { Redirect } from 'react-router'
import { ADMIN_PATH } from '@core/Constants'
import { useAuthValue } from './AuthContext'
import { RouteProps } from '@core'
import { RouteLoading } from './RouteLoading'
import { Box, Button, Container, Typography } from '@mui/material'
import { logOut } from '@fire'
import { useCourseValue } from '@context/CourseContext'
import { useStudentValue } from '@context/StudentContext'
import { useTemplateValue } from '@context/TemplateContext'

export const PrivateRoute = ({ children }: RouteProps) => {
  const { authState } = useAuthValue()
  const { hasLoadedCourses } = useCourseValue()
  const { hasLoadedStudents } = useStudentValue()
  const { hasLoadedTemplates } = useTemplateValue()

  console.log(authState)

  switch (authState) {
    case 'loading':
      return <RouteLoading isLoading={true} />
    // not logged in, redirect back to home page
    case 'unauthenticated':
      return <Redirect to={ADMIN_PATH} />
    // unauthorized, so display message to user that you are unauthorized
    case 'unauthorized':
      return (
        <Container maxWidth="md">
          <Typography variant="h5" component="p" align="center" mt={5}>
            You are not authorized to view this content. Contact an admin if you
            feel like this is a mistake. Click the button below to log out.
          </Typography>
          <Box display="flex" justifyContent="center" margin={4}>
            <Button onClick={logOut}>Log out</Button>
          </Box>
        </Container>
      )
    // authorized, hooray, you can see the content!
    case 'authorized':
      return hasLoadedCourses && hasLoadedStudents && hasLoadedTemplates ? (
        children
      ) : (
        <RouteLoading
          isLoading={true}
          hasLoadedCourses={hasLoadedCourses}
          hasLoadedStudents={hasLoadedStudents}
          hasLoadedTemplates={hasLoadedTemplates}
        />
      )
  }
}
