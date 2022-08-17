import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import {
  Alert,
  Snackbar,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material'
import { CssBaseline } from '@mui/material'
import {
  HOME_PATH,
  ADMIN_PATH,
  SURVEY_PATH,
  CREATE_ZING_PATH,
  EDIT_ZING_PATH,
  DASHBOARD_PATH,
  EMAIL_PATH,
  API_ROOT,
  TEMPLATE_EDITOR_PATH,
  COURSE_API,
  STUDENT_API,
} from '@core/Constants'
import {
  Course,
  responseCourseToCourse,
  responseStudentToStudent,
  Student,
} from '@core/Types'
import { Home } from 'Home'
import { AdminHome } from 'AdminHome'
import { Survey } from 'Survey'
import { CreateZingForm } from 'CreateZing'
import { EditZing } from 'EditZing'
import { Dashboard } from 'Dashboard'
import { Emailing } from 'Emailing'
import { TemplateEditor } from 'TemplateEditor'
import './App.css'
import theme from '@core/Constants/Theme'
import { User, onAuthStateChanged } from 'firebase/auth'
import { AuthProvider, AuthState, PrivateRoute, PublicRoute } from '@auth'
import { appCheck, auth } from '@fire'
import axios from 'axios'
import { CourseProvider, StudentProvider } from '@context'
import { getToken } from 'firebase/app-check'

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authState, setAuthState] = useState<AuthState>('loading')
  const axiosAuthInterceptor = useRef<number | null>(null)
  const [networkError, setNetworkError] = useState<string | null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      // need these to conditions to resolve isLoading at the correct time so data can be loaded properly
      if (user) {
        user
          .getIdToken(true)
          .then((idToken) => {
            if (axiosAuthInterceptor.current === null) {
              // interceptor so that every axios request will have this header
              axiosAuthInterceptor.current = axios.interceptors.request.use(
                (request) => {
                  request.headers.authorization = `Bearer ${idToken}`
                  return request
                },
                (error) => {
                  return Promise.reject(error)
                }
              )
            }

            axios.get(`${API_ROOT}/getauth`).then(
              (res) => {
                setAuthState(
                  res.data.data.isAuthed ? 'authorized' : 'unauthorized'
                )
                if (res.data.data.isAuthed) {
                  loadCourses()
                  loadStudents()
                }
              },
              (error) => setNetworkError(error.message)
            )
          })
          .catch(() => {
            setAuthState('unauthenticated')
          })
      } else {
        if (axiosAuthInterceptor.current !== null) {
          axios.interceptors.request.eject(axiosAuthInterceptor.current)
          axiosAuthInterceptor.current = null
        }
        setAuthState('unauthenticated')
      }
    })
  }, [])

  // Application-wide courses are only loaded when user is authorized
  const [courses, setCourses] = useState<Course[]>([])

  const loadCourses = () => {
    axios.get(`${API_ROOT}${COURSE_API}`).then(
      (res) => setCourses(res.data.map(responseCourseToCourse)),
      (error) => console.log(error)
    )
  }

  // Application-wide students are only loaded when user is authorized
  const [students, setStudents] = useState<Student[]>([])

  const loadStudents = () => {
    axios.get(`${API_ROOT}${STUDENT_API}`).then(
      (res) => setStudents(res.data.map(responseStudentToStudent)),
      (error) => console.log(error)
    )
  }

  // Because we are calling backend through HTTP directly, it's like a custom resource:
  // https://firebase.google.com/docs/app-check/web/custom-resource
  useEffect(() => {
    axios.interceptors.request.use(
      async (request) => {
        const appCheckTokenResponse = await getToken(appCheck, false)
        request.headers['X-Firebase-AppCheck'] = appCheckTokenResponse.token
        return request
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  })

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider
            value={{
              user: currentUser,
              authState,
              displayNetworkError: setNetworkError,
            }}
          >
            <CourseProvider value={{ courses }}>
              <StudentProvider value={{ students }}>
                <Switch>
                  <PublicRoute exact path={HOME_PATH} component={Home} />
                  <PublicRoute exact path={ADMIN_PATH} component={AdminHome} />
                  <Route exact path={SURVEY_PATH} component={Survey} />
                  <Route
                    exact
                    path={CREATE_ZING_PATH}
                    component={CreateZingForm}
                  />
                  <PrivateRoute
                    exact
                    path={DASHBOARD_PATH}
                    component={Dashboard}
                  />
                  <PrivateRoute exact path={EMAIL_PATH} component={Emailing} />
                  <PrivateRoute
                    exact
                    path={`${EDIT_ZING_PATH}/:courseId`}
                    component={EditZing}
                  />
                  <PrivateRoute
                    exact
                    path={TEMPLATE_EDITOR_PATH}
                    component={TemplateEditor}
                  />
                </Switch>
              </StudentProvider>
            </CourseProvider>
          </AuthProvider>
        </Router>
        <Snackbar open={networkError !== null}>
          <Alert severity="error" variant="filled">
            Could not perform request: {networkError}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
