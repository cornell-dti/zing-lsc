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
  EDIT_ZING_PATH,
  DASHBOARD_PATH,
  EMAIL_PATH,
  TEMPLATE_EDITOR_PATH,
  API_ROOT,
  COURSE_API,
  STUDENT_API,
  MATCHING_API,
} from '@core/Constants'
import {
  Course,
  responseCourseToCourse,
  Group,
  responseGroupToGroup,
  Student,
  responseStudentToStudent,
  EmailTemplate,
  EmailTemplatesResponse,
  responseEmailTemplateToEmailTemplate,
} from '@core/Types'
import { Home } from 'Home'
import { AdminHome } from 'AdminHome'
import { Survey } from 'Survey'
import { EditZing } from 'EditZing'
import { Dashboard } from 'Dashboard'
import { Emailing } from 'Emailing'
import { TemplateEditor } from 'TemplateEditor'
import './App.css'
import theme from '@core/Constants/Theme'
import { User, onAuthStateChanged } from 'firebase/auth'
import { AuthProvider, AuthState, PrivateRoute, PublicRoute } from '@auth'
import { auth } from '@fire'
import { templatesBucket } from '@fire/firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import axios, { AxiosResponse } from 'axios'
import { CourseProvider, StudentProvider } from '@context'
import { TemplateProvider } from '@context/TemplateContext'

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
                  loadTemplates()
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
  const [hasLoadedCourses, setHasLoadedCourses] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])

  const loadCourses = () => {
    axios.get(`${API_ROOT}${COURSE_API}`).then(
      (res) => {
        setCourses(res.data.map(responseCourseToCourse))
        setHasLoadedCourses(true)
      },
      (error) => {
        console.log(error)
        setNetworkError(error.message)
      }
    )
  }

  // Application-wide students are only loaded when user is authorized
  const [hasLoadedStudents, setHasLoadedStudents] = useState(false)
  const [students, setStudents] = useState<Student[]>([])

  const loadStudents = () => {
    axios.get(`${API_ROOT}${STUDENT_API}`).then(
      (res) => {
        setStudents(res.data.map(responseStudentToStudent))
        setHasLoadedStudents(true)
      },
      (error) => {
        console.log(error)
        setNetworkError(error.message)
      }
    )
  }

  /** Add an unmatched student to a group */
  const moveStudentFromUnmatched = (
    studentEmail: string,
    courseId: string,
    toGroupNumber: number
  ) => {
    setCourses(
      courses.map((course) =>
        course.courseId === courseId
          ? {
              ...course,
              unmatched: course.unmatched.filter(
                (student) => student !== studentEmail
              ),
              groups: course.groups.map((group) =>
                group.groupNumber === toGroupNumber
                  ? { ...group, members: [...group.members, studentEmail] }
                  : group
              ),
            }
          : course
      )
    )
    setStudents(
      students.map((student) =>
        student.email === studentEmail
          ? {
              ...student,
              groups: student.groups.map((membership) =>
                membership.courseId === courseId
                  ? { ...membership, groupNumber: toGroupNumber }
                  : membership
              ),
            }
          : student
      )
    )
    axios
      .post(`${API_ROOT}${MATCHING_API}/transfer/unmatched`, {
        courseId: courseId,
        studentEmail: studentEmail,
        groupNumber: toGroupNumber,
      })
      .catch((error) => setNetworkError(error.message))
  }

  /** Move a student already in a group back to unmatched */
  const moveStudentToUnmatched = (
    studentEmail: string,
    courseId: string,
    fromGroupNumber: number
  ) => {
    setCourses(
      courses.map((course) =>
        course.courseId === courseId
          ? {
              ...course,
              unmatched: [...course.unmatched, studentEmail],
              groups: course.groups.map((group) =>
                group.groupNumber === fromGroupNumber
                  ? {
                      ...group,
                      members: group.members.filter(
                        (student) => student !== studentEmail
                      ),
                    }
                  : group
              ),
            }
          : course
      )
    )
    setStudents(
      students.map((student) =>
        student.email === studentEmail
          ? {
              ...student,
              groups: student.groups.map((membership) =>
                membership.courseId === courseId
                  ? { ...membership, groupNumber: -1 }
                  : membership
              ),
            }
          : student
      )
    )
    axios
      .post(`${API_ROOT}${MATCHING_API}/transfer/unmatch`, {
        courseId: courseId,
        studentEmail: studentEmail,
        groupNumber: fromGroupNumber,
      })
      .catch((error) => setNetworkError(error.message))
  }

  /** Transfer a student from a group to another group */
  const moveStudentIntergroup = (
    studentEmail: string,
    courseId: string,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => {
    setCourses(
      courses.map((course) =>
        course.courseId === courseId
          ? {
              ...course,
              groups: course.groups.map((group) =>
                group.groupNumber === toGroupNumber
                  ? { ...group, members: [...group.members, studentEmail] }
                  : group.groupNumber === fromGroupNumber
                  ? {
                      ...group,
                      members: group.members.filter(
                        (student) => student !== studentEmail
                      ),
                    }
                  : group
              ),
            }
          : course
      )
    )
    setStudents(
      students.map((student) =>
        student.email === studentEmail
          ? {
              ...student,
              groups: student.groups.map((membership) =>
                membership.courseId === courseId
                  ? { ...membership, groupNumber: toGroupNumber }
                  : membership
              ),
            }
          : student
      )
    )
    axios
      .post(`${API_ROOT}${MATCHING_API}/transfer/intergroup`, {
        courseId: courseId,
        studentEmail: studentEmail,
        group1: fromGroupNumber,
        group2: toGroupNumber,
      })
      .catch((error) => setNetworkError(error.message))
  }

  /** Move a student from some group (existing/unmatched) to a group */
  const moveStudent = (
    studentEmail: string,
    courseId: string,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => {
    if (fromGroupNumber !== toGroupNumber) {
      if (fromGroupNumber === -1) {
        moveStudentFromUnmatched(studentEmail, courseId, toGroupNumber)
      } else if (toGroupNumber === -1) {
        moveStudentToUnmatched(studentEmail, courseId, fromGroupNumber)
      } else {
        moveStudentIntergroup(
          studentEmail,
          courseId,
          fromGroupNumber,
          toGroupNumber
        )
      }
    }
  }

  /** Make matches of all unmatched students in a course */
  const matchStudents = async (courseId: string) => {
    try {
      const response = await axios.post(`${API_ROOT}${MATCHING_API}/make`, {
        courseId: courseId,
      })
      const newGroups: Group[] = response.data.groups.map(responseGroupToGroup)
      const updatedStudents = newGroups.flatMap((group) => group.members)
      setCourses(
        courses.map((course) =>
          course.courseId === courseId
            ? {
                ...course,
                unmatched: response.data.unmatched,
                groups: [...course.groups, ...newGroups],
                lastGroupNumber: course.groups.length + newGroups.length,
              }
            : course
        )
      )
      setStudents(
        students.map((student) =>
          updatedStudents.includes(student.email)
            ? {
                ...student,
                groups: student.groups.map((membership) =>
                  membership.courseId === courseId
                    ? {
                        ...membership,
                        groupNumber: newGroups.find((group) =>
                          group.members.includes(student.email)
                        )!.groupNumber,
                      }
                    : membership
                ),
              }
            : student
        )
      )
    } catch (error: any) {
      setNetworkError(error.message)
      throw error
    }
  }

  /** Update notes for a student */
  const updateNotes = async (
    studentEmail: string,
    courseId: string,
    notes: string
  ) => {
    try {
      await axios.post(`${API_ROOT}${STUDENT_API}/notes`, {
        email: studentEmail,
        courseId: courseId,
        notes: notes,
      })
      setStudents(
        students.map((student) =>
          student.email === studentEmail
            ? {
                ...student,
                groups: student.groups.map((membership) =>
                  membership.courseId === courseId
                    ? { ...membership, notes }
                    : membership
                ),
              }
            : student
        )
      )
    } catch (error: any) {
      setNetworkError(error.message)
      throw error
    }
  }

  /** Add a new timestamp to multiple students' email timestamps */
  const addStudentEmailTimestamps = (
    studentEmails: string[],
    courseId: string,
    templateId: string,
    timestamp: Date
  ) => {
    setStudents(
      students.map((student) =>
        studentEmails.includes(student.email)
          ? {
              ...student,
              groups: student.groups.map((membership) =>
                membership.courseId === courseId
                  ? {
                      ...membership,
                      templateTimestamps: {
                        ...membership.templateTimestamps,
                        [templateId]: timestamp,
                      },
                    }
                  : membership
              ),
            }
          : student
      )
    )
  }

  /** Add a new timestamp to multiple groups' email timestamps */
  const addGroupEmailTimestamps = (
    groupNumbers: number[],
    courseId: string,
    templateId: string,
    timestamp: Date
  ) => {
    setCourses(
      courses.map((course) =>
        course.courseId === courseId
          ? {
              ...course,
              groups: course.groups.map((group) =>
                groupNumbers.includes(group.groupNumber)
                  ? {
                      ...group,
                      templateTimestamps: {
                        ...group.templateTimestamps,
                        [templateId]: timestamp,
                      },
                    }
                  : group
              ),
            }
          : course
      )
    )
  }

  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [hasLoadedTemplates, setHasLoadedTemplates] = useState(false)

  const loadTemplates = () => {
    axios.get(`${API_ROOT}${EMAIL_PATH}/templates`).then(
      async (res: AxiosResponse<EmailTemplatesResponse>) => {
        const templates = await Promise.all(
          res.data.data
            .map(responseEmailTemplateToEmailTemplate)
            .map(async (template) => {
              // Download the HTML for the email body in Cloud Storage bucket
              const url = await getDownloadURL(
                ref(templatesBucket, template.body)
              )
              const html = (await axios.get(url)).data as string
              return { ...template, html }
            })
        )
        setTemplates(templates)
        setHasLoadedTemplates(true)
      },
      (error) => {
        console.log(error)
        setNetworkError(error.message)
      }
    )
  }

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
            <CourseProvider
              value={{
                hasLoadedCourses,
                courses,
                moveStudent,
                matchStudents,
                addGroupEmailTimestamps,
              }}
            >
              <StudentProvider
                value={{
                  hasLoadedStudents,
                  students,
                  updateNotes,
                  addStudentEmailTimestamps,
                }}
              >
                <TemplateProvider
                  value={{
                    hasLoadedTemplates,
                    templates,
                  }}
                >
                  <Switch>
                    <PublicRoute exact path={HOME_PATH} component={Home} />
                    <PublicRoute
                      exact
                      path={ADMIN_PATH}
                      component={AdminHome}
                    />
                    <Route exact path={SURVEY_PATH} component={Survey} />
                    <PrivateRoute
                      exact
                      path={DASHBOARD_PATH}
                      component={Dashboard}
                    />
                    <PrivateRoute
                      exact
                      path={EMAIL_PATH}
                      component={Emailing}
                    />
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
                </TemplateProvider>
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
