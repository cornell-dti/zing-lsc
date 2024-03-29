import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import {
  Alert,
  Button,
  Snackbar,
  StyledEngineProvider,
  ThemeProvider,
  SelectChangeEvent,
} from '@mui/material'
import { CssBaseline } from '@mui/material'
import {
  HOME_PATH,
  ADMIN_PATH,
  SURVEY_PATH,
  EDIT_ZING_PATH,
  DASHBOARD_PATH,
  METRICS_PATH,
  EMAIL_PATH,
  TEMPLATE_EDITOR_PATH,
  API_ROOT,
  COURSE_API,
  STUDENT_API,
  MATCHING_API,
  SETTINGS_PATH,
  SETTINGS_API,
} from '@core/Constants'
import {
  Course,
  Admin,
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
import { Metrics } from './modules/Metrics/Components/Metrics'
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
import { Settings } from 'Settings'
import { SettingsProvider } from '@context/SettingsContext'

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authState, setAuthState] = useState<AuthState>('loading')
  const axiosAuthInterceptor = useRef<number | null>(null)
  const [networkError, setNetworkError] = useState<string | null>(null)

  const [needsRefresh, setNeedsRefresh] = useState(false)
  const checkRefreshDuration = 600000 // (10 min)

  const [currRoster, setCurrRoster] = useState<string>('')
  const [hasLoadedCurrRoster, setHasLoadedCurrRoster] = useState<boolean>(false)

  const loadCurrRoster = () => {
    axios.get(`${API_ROOT}${SETTINGS_API}/semester/current`).then(
      (req) => {
        setCurrRoster(req.data)
        setHasLoadedCurrRoster(true)
      },
      (error) => {
        console.log(error)
        setNetworkError(error.message)
      }
    )
  }

  const changeCurrRoster = async (event: SelectChangeEvent) => {
    // function to only open the survey of the semester
    setCurrRoster(event.target.value)
    await axios.post(`${API_ROOT}${SETTINGS_API}/semester/current`, {
      semester: event.target.value,
    })
  }

  const [surveyState, setSurveyState] = useState<boolean>(false)
  const [hasLoadedSurveyState, setHasLoadedSurveyState] = useState<boolean>(
    false
  )

  const loadSurveyState = () => {
    axios.get(`${API_ROOT}${SETTINGS_API}/semester/survey`).then(
      (req) => {
        setSurveyState(req.data)
        setHasLoadedSurveyState(true)
      },
      (error) => {
        console.log(error)
        setNetworkError(error.message)
      }
    )
  }

  const changeSurveyAvailability = async () => {
    axios.post(`${API_ROOT}${SETTINGS_API}/semester/survey`, {
      surveyOpen: !surveyState,
    })
    setSurveyState(!surveyState)
  }

  const [administrators, setAdministrators] = useState<Admin[]>([])
  const [
    hasLoadedAdministrators,
    setHasLoadedAdministrators,
  ] = useState<boolean>(false)

  const loadAdministrators = () => {
    axios.get(`${API_ROOT}/admin`).then(
      (req) => {
        setAdministrators(req.data)
        setHasLoadedAdministrators(true)
      },
      (error) => {
        console.log(error)
        setNetworkError(error.message)
      }
    )
  }

  const removeAdmin = (admin: Admin) => {
    axios
      .delete(`${API_ROOT}/admin`, { data: admin })
      .then(() => {
        administrators.forEach((email, index) => {
          if ((email.email = admin.email)) {
            administrators.splice(index, 1)
            loadAdministrators()
          }
        })
      })
      .catch((err) => console.log(err))
  }

  const addAdmin = (admin: Admin) => {
    axios
      .post(`${API_ROOT}/admin`, admin)
      .then(() => {
        administrators.push(admin)
        loadAdministrators()
      })
      .catch((err) => console.log(err))
  }

  const [semesterAdded, setSemesterAdded] = useState<boolean>(false)
  const addSemester = (selectedSeason: string, year: string) => {
    axios
      .post(`${API_ROOT}/global/semester`, {
        semester: selectedSeason + year,
      })
      .then(() => {
        const sem = selectedSeason + year
        setSemesters(
          semesters.indexOf(sem) === -1
            ? semesters.concat(selectedSeason + year).sort(sortSemesters)
            : semesters
        )
        setSemesterAdded(true)
      })
      .catch((err) => console.log(err))
  }

  const reloadButton = (
    <Button
      variant="text"
      size="small"
      onClick={() => window.location.reload()}
      color="secondary"
    >
      Reload
    </Button>
  )

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
                  loadCurrRoster()
                  loadSurveyState()
                  loadAdministrators()
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

  const semValueMap = new Map([
    ['WI', 0],
    ['SP', 1],
    ['SU', 2],
    ['FA', 3],
  ])

  const sortSemesters = (a: string, b: string) => {
    const aSemPrefix = a.substring(0, 2)
    const bSemPrefix = b.substring(0, 2)
    const aSemYear = Number(a.substring(2))
    const bSemYear = Number(b.substring(2))
    return (
      aSemYear - bSemYear ||
      semValueMap.get(aSemPrefix)! - semValueMap.get(bSemPrefix)!
    )
  }

  // Application-wide courses are only loaded when user is authorized
  const [hasLoadedCourses, setHasLoadedCourses] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [semesters, setSemesters] = useState<string[]>([])

  const loadCourses = () => {
    axios.get(`${API_ROOT}${COURSE_API}`).then(
      (res) => {
        setCourses(res.data.map(responseCourseToCourse))
        // TODO: MOVE THIS TO ITS OWN CONTEXT
        axios.get(`${API_ROOT}${SETTINGS_API}/semester/all`).then((res) => {
          setHasLoadedCourses(true)
          setSemesters(res.data.sort(sortSemesters))
        })
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

  useEffect(() => {
    if (hasLoadedCourses && hasLoadedStudents) {
      const interval = setInterval(async () => {
        let newStudents = []

        try {
          newStudents = (await axios.get(`${API_ROOT}${STUDENT_API}`)).data.map(
            responseStudentToStudent
          )
        } catch (e) {
          setNetworkError('Error fetching students')
        }

        if (newStudents.length !== students.length) {
          setNeedsRefresh(true)
          return
        }

        newStudents.forEach((student: Student, index: number) => {
          let groupMembership = student.groups
          let oldGroupMembership = students[index].groups
          if (groupMembership.length === oldGroupMembership.length) {
            groupMembership.forEach((membership, ind) => {
              if (
                membership.groupNumber !== oldGroupMembership[ind].groupNumber
              ) {
                setNeedsRefresh(true)
              }
            })
          } else {
            setNeedsRefresh(true)
          }
        })
      }, checkRefreshDuration)
      return () => clearInterval(interval)
    }
  }, [
    courses,
    courses.length,
    hasLoadedCourses,
    hasLoadedStudents,
    students,
    students.length,
  ])

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

  /** Save form fields to local template to keep when changing template */
  const keepForm = (
    selectedTemplateId: string,
    templateName: string,
    templateType: 'group' | 'student',
    templateSubject: string,
    templateHtml: string
  ) =>
    setTemplates(
      templates.map((template) =>
        template.id === selectedTemplateId
          ? {
              ...template,
              name: templateName,
              type: templateType,
              subject: templateSubject,
              modifyTime: new Date(),
              html: templateHtml,
            }
          : template
      )
    )

  /** Append form fields to local templates for local update on add new form */
  const appendForm = (
    id: string,
    templateName: string,
    templateType: 'group' | 'student',
    templateSubject: string,
    templateHtml: string
  ) =>
    setTemplates([
      ...templates,
      {
        id,
        name: templateName,
        type: templateType,
        subject: templateSubject,
        modifyTime: new Date(),
        body: `${id}.html`,
        html: templateHtml,
      },
    ])

  // update whats shown on the frontend
  const removeGroups = (
    courseId: string,
    groupNumber: number,
    toHide: boolean
  ) => {
    setCourses(
      courses.map((course) =>
        course.courseId === courseId
          ? {
              ...course,
              unmatched: [...course.unmatched],
              groups: course.groups.map((group) =>
                groupNumber === group.groupNumber
                  ? { ...group, hidden: toHide }
                  : group
              ),
            }
          : course
      )
    )
  }

  /** Update flagged status on the frontend */
  const updateFlagged = (courseId: string, flag: boolean) => {
    setCourses(
      courses.map((course) =>
        course.courseId === courseId ? { ...course, flagged: flag } : course
      )
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
            <SettingsProvider
              value={{
                hasLoadedCurrRoster,
                hasLoadedSurveyState,
                hasLoadedAdministrators,

                currRoster,
                surveyState,
                administrators,
                semesterAdded,

                setCurrRoster,
                changeCurrRoster,
                changeSurveyAvailability,
                removeAdmin,
                addAdmin,
                addSemester,
                setSemesterAdded,
              }}
            >
              <CourseProvider
                value={{
                  hasLoadedCourses,
                  semesters,
                  courses,
                  moveStudent,
                  matchStudents,
                  addGroupEmailTimestamps,
                  removeGroups,
                  updateFlagged,
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
                      keepForm,
                      appendForm,
                    }}
                  >
                    <Snackbar
                      open={needsRefresh}
                      message="The information in your app is out of date. Please reload to see the latest updates."
                      action={reloadButton}
                    />
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
                        path={METRICS_PATH}
                        component={Metrics}
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
                      <PrivateRoute
                        exact
                        path={SETTINGS_PATH}
                        component={Settings}
                      />
                    </Switch>
                  </TemplateProvider>
                </StudentProvider>
              </CourseProvider>
            </SettingsProvider>
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
