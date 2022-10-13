import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import GroupCard from 'EditZing/Components/GroupCard'
import { UnmatchedGrid } from './UnmatchedGrid'
import {
  responseStudentToStudent,
  Student,
  responseTimestampsToDate,
  EmailTemplatesResponse,
} from '@core/Types'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  CourseInfo,
  CourseInfoResponse,
  CourseStudentDataResponse,
  Group,
  ResponseGroup,
} from 'EditZing/Types/CourseInfo'
import { API_ROOT, COURSE_API, MATCHING_API, EMAIL_PATH } from '@core/Constants'
import { Link, useParams } from 'react-router-dom'
import { EmailModal } from 'EditZing/Components/EmailModal'
import { MatchLoading } from './MatchLoading'
import {
  Box,
  Button,
  Menu,
  MenuItem,
  SvgIcon,
  SvgIconProps,
  Typography,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material'
import { ReactComponent as Lsc } from '@assets/img/lscicon.svg'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useAuthValue } from '@auth/AuthContext'

import { DASHBOARD_PATH } from '@core/Constants'

const LscIcon = (props: SvgIconProps) => {
  return <SvgIcon inheritViewBox component={Lsc} {...props} />
}

export const EditZing = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const [showError, setShowError] = useState(false)

  const { displayNetworkError } = useAuthValue()

  const [courseInfo, setCourseInfo] = useState<CourseInfo>()
  const [isEmailing, setIsEmailing] = useState<boolean>(false)

  /*  Snackbars  */
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [emailSentError, setEmailSentError] = useState<boolean>(false)
  const emailSentAction = (
    <Button
      variant="text"
      sx={{ color: 'purple.50' }}
      size="small"
      onClick={() =>
        window.open(
          'https://outlook.office.com/mail/lscstudypartners@cornell.edu/',
          '_blank'
        )
      }
    >
      View in Inbox
    </Button>
  )

  useEffect(() => {
    axios
      .get(`${API_ROOT}${COURSE_API}/${courseId}`)
      .then((res: AxiosResponse<CourseInfoResponse>) => {
        setCourseInfo(res.data.data)
      })
      .catch((error) => {
        console.error(error)
        setShowError(true)
      })
  }, [courseId])

  const [selectedGroupNumbers, setSelectedGroupNumbers] = useState<number[]>([])

  const editSelectedGroups = (group: Group, selected: boolean) => {
    if (selected) {
      setSelectedGroupNumbers([...selectedGroupNumbers, group.groupNumber])
    } else {
      setSelectedGroupNumbers(
        selectedGroupNumbers.filter((g) => g !== group.groupNumber)
      )
    }
  }

  //Map for getting the names of templates based on ID for rendering tooltips
  const [templateNameMap, setTemplateNameMap] = useState<{
    [key: string]: string
  }>({})
  useEffect(() => {
    axios
      .get(`${API_ROOT}${EMAIL_PATH}/templates`)
      .then((res: AxiosResponse<EmailTemplatesResponse>) => {
        setTemplateNameMap(
          Object.fromEntries(
            res.data.data.map((template) => [template.id, template.name])
          )
        )
      })
      .catch((error) => {
        console.error(error)
        setShowError(true)
      })
  }, [courseId])

  const [unmatchedStudents, setUnmatchedStudents] = useState<Student[]>([])
  const [studentGroups, setStudentGroups] = useState<Group[]>([])
  const [hasLoadedStudentData, setHasLoadedStudentData] = useState(false)

  useEffect(() => {
    axios
      .get(`${API_ROOT}${COURSE_API}/students/${courseId}`)
      .then((res: AxiosResponse<CourseStudentDataResponse>) => {
        setUnmatchedStudents(
          res.data.data.unmatched.map(responseStudentToStudent)
        )
        let orderedGroups: Group[] = []
        for (let i = 1; i <= res.data.data.groups.length; i++) {
          res.data.data.groups.forEach((group) => {
            if (group.groupNumber === i) {
              orderedGroups.push({
                ...group,
                memberData: group.memberData.map(responseStudentToStudent),
                createTime: new Date(group.createTime),
                updateTime: new Date(group.updateTime),
                templateTimestamps: responseTimestampsToDate(
                  group.templateTimestamps
                ),
              })
            }
          })
        }
        setStudentGroups(orderedGroups)
        setHasLoadedStudentData(true)
      })
      .catch((error) => {
        console.error(error)
        setShowError(true)
      })
  }, [courseId])

  const [showMatchLoading, setShowMatchLoading] = useState(false)
  const [isCurrentlyGrouping, setIsCurrentlyGrouping] = useState(false)

  /** Add an unmatched student to a group */
  const moveStudentFromUnmatched = (
    student: Student,
    toGroupNumber: number
  ) => {
    setUnmatchedStudents(
      unmatchedStudents.filter((s) => s.email !== student.email)
    )
    setStudentGroups(
      studentGroups.map((group) =>
        group.groupNumber === toGroupNumber
          ? { ...group, memberData: [...group.memberData, student] }
          : group
      )
    )
    axios
      .post(`${API_ROOT}${MATCHING_API}/transfer/unmatched`, {
        courseId: courseId,
        studentEmail: student.email,
        groupNumber: toGroupNumber,
      })
      .catch((error) => displayNetworkError(error.message))
  }

  /** Move a student already in a group back to unmatched */
  const moveStudentToUnmatched = (
    student: Student,
    fromGroupNumber: number
  ) => {
    setUnmatchedStudents([...unmatchedStudents, student])
    setStudentGroups(
      studentGroups.map((group) =>
        group.groupNumber === fromGroupNumber
          ? {
              ...group,
              memberData: group.memberData.filter(
                (s) => s.email !== student.email
              ),
            }
          : group
      )
    )
    axios
      .post(`${API_ROOT}${MATCHING_API}/transfer/unmatch`, {
        courseId: courseId,
        studentEmail: student.email,
        groupNumber: fromGroupNumber,
      })
      .catch((error) => displayNetworkError(error.message))
  }

  /** Transfer a student from a group to another group */
  const moveStudentIntergroup = (
    student: Student,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => {
    setStudentGroups(
      studentGroups.map((group) =>
        group.groupNumber === toGroupNumber
          ? { ...group, memberData: [...group.memberData, student] }
          : group.groupNumber === fromGroupNumber
          ? {
              ...group,
              memberData: group.memberData.filter(
                (s) => s.email !== student.email
              ),
            }
          : group
      )
    )
    axios
      .post(`${API_ROOT}${MATCHING_API}/transfer/intergroup`, {
        courseId: courseId,
        studentEmail: student.email,
        group1: fromGroupNumber,
        group2: toGroupNumber,
      })
      .catch((error) => displayNetworkError(error.message))
  }

  /** Move a student from some group (existing/unmatched) to a group */
  const moveStudent = (
    student: Student,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => {
    if (fromGroupNumber !== toGroupNumber) {
      if (fromGroupNumber === -1) {
        moveStudentFromUnmatched(student, toGroupNumber)
      } else if (toGroupNumber === -1) {
        moveStudentToUnmatched(student, fromGroupNumber)
      } else {
        moveStudentIntergroup(student, fromGroupNumber, toGroupNumber)
      }
    }
  }

  /** called by the match button to match the unmatched students */
  const matchStudents = () => {
    setShowMatchLoading(true)
    setIsCurrentlyGrouping(true)
    axios
      .post(`${API_ROOT}${MATCHING_API}/make`, { courseId: courseId })
      .then((response) => {
        setUnmatchedStudents(
          response.data.data.unmatched.map(responseStudentToStudent)
        )
        const groups = studentGroups.concat(
          response.data.data.groups.map((group: ResponseGroup) => ({
            ...group,
            memberData: group.memberData.map(responseStudentToStudent),
            createTime: new Date(group.createTime),
            updateTime: new Date(group.updateTime),
            //the group was just created so no emails have been sent yet
            templateTimestamps: {},
          }))
        )
        setStudentGroups(groups)
        setIsCurrentlyGrouping(false)
      })
      .catch((error) => displayNetworkError(error.message))
  }

  /** Handles updating the groups state when we send an email so timestamp shows directly after email is sent without requiring page refresh. */
  const handleEmailTimestamp = () => {
    // this is not efficient, you can just update the groups locally
    axios
      .get(`${API_ROOT}${COURSE_API}/students/${courseId}`)
      .then((res: AxiosResponse<CourseStudentDataResponse>) => {
        setUnmatchedStudents(
          res.data.data.unmatched.map(responseStudentToStudent)
        )
        setStudentGroups(
          res.data.data.groups.map((group) => ({
            ...group,
            memberData: group.memberData.map(responseStudentToStudent),
            createTime: new Date(group.createTime),
            updateTime: new Date(group.updateTime),
            templateTimestamps: responseTimestampsToDate(
              group.templateTimestamps
            ),
          }))
        )
      })
      .catch((error) => displayNetworkError(error.message))
  }

  const selectedGroups = studentGroups.filter((group) =>
    selectedGroupNumbers.includes(group.groupNumber)
  )

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const handleAddStudent = (student: string, selected: boolean) => {
    if (selected) {
      setSelectedStudents((arr) => [...arr, student])
    } else {
      setSelectedStudents(selectedStudents.filter((item) => item !== student))
    }
  }

  // Open and close the 'Send email to' menu drop down
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSelectNewlyMatched = () => {
    setSelectedGroupNumbers(
      studentGroups
        .filter((group) => !group.templateTimestamps['share-match'])
        .map((group) => group.groupNumber)
    )
    handleMenuClose()
  }

  const handleSelectNoMatchYet = () => {
    setSelectedStudents(
      unmatchedStudents
        .filter(
          (student) =>
            !student.groups.find(
              (membership) => membership.courseId === courseId
            )?.templateTimestamps['no-match-yet']
        )
        .map((student) => student.email)
    )
    handleMenuClose()
  }

  /** Helper: return a new Student with the specified notes for particular courseId */
  const studentWithNotes = (
    student: Student,
    courseId: string,
    notes: string
  ): Student => ({
    ...student,
    groups: student.groups.map((group) =>
      group.courseId === courseId ? { ...group, notes } : group
    ),
  })

  /** Update notes for a student in some group or unmatched */
  const updateNotes = (student: string, notes: string) => {
    if (unmatchedStudents.some((s) => s.email === student)) {
      setUnmatchedStudents(
        unmatchedStudents.map((s) =>
          s.email === student ? studentWithNotes(s, courseId, notes) : s
        )
      )
    } else {
      setStudentGroups(
        studentGroups.map((g) =>
          g.memberData.some((s) => s.email === student)
            ? {
                ...g,
                memberData: g.memberData.map((s) =>
                  s.email === student ? studentWithNotes(s, courseId, notes) : s
                ),
              }
            : g
        )
      )
    }
  }

  return courseInfo && hasLoadedStudentData ? (
    <Box
      sx={{
        paddingBottom: '100px',
      }}
    >
      {isEmailing && (
        <EmailModal
          selectedGroups={selectedGroups}
          selectedStudents={selectedStudents}
          isEmailing={isEmailing}
          setIsEmailing={setIsEmailing}
          setEmailSent={setEmailSent}
          setEmailSentError={setEmailSentError}
          courseNames={courseInfo.names}
          handleEmailTimestamp={handleEmailTimestamp}
        />
      )}
      <MatchLoading
        showMatchLoading={showMatchLoading}
        isCurrentlyGrouping={isCurrentlyGrouping}
        numberGrouping={unmatchedStudents.length}
        courseNames={courseInfo.names}
        setShowMatchLoading={setShowMatchLoading}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          height: (theme) => theme.spacing(17),
          p: 6,
          pb: 4,
          borderBottom: 1,
          borderBottomColor: 'essentials.12',
        }}
      >
        <IconButton
          color="secondary"
          component={Link}
          to={DASHBOARD_PATH}
          sx={{
            border: 'none',
          }}
          disableRipple
          disableFocusRipple
        >
          <LscIcon sx={{ height: '50px', width: '50px' }} />
        </IconButton>
        <Typography variant="h4" component="h1">
          {courseInfo.names.join(', ')} ({courseInfo.roster})
        </Typography>
        <Box flexGrow={2} />
        {selectedGroupNumbers.length === 0 && selectedStudents.length === 0 ? (
          <>
            <Button
              onClick={handleMenuOpen}
              endIcon={menuOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              Send email to
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleSelectNewlyMatched}>
                Newly Matched
              </MenuItem>
              <MenuItem onClick={handleSelectNoMatchYet}>No Match Yet</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            disabled={
              selectedGroupNumbers.length > 0 && selectedStudents.length > 0
            }
            onClick={() => setIsEmailing(!isEmailing)}
          >
            Email selected
          </Button>
        )}
      </Box>

      <Box m={6}>
        <DndProvider backend={HTML5Backend}>
          <Box
            sx={{
              margin: '32px 0',
              gap: '32px',
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(380px, max-content))',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ gridColumn: '1 / -1' }}>
              <UnmatchedGrid
                courseId={courseId}
                unmatchedStudents={unmatchedStudents}
                moveStudent={moveStudent}
                matchStudents={matchStudents}
                templateMap={templateNameMap}
                selectedStudents={selectedStudents}
                handleAddStudent={handleAddStudent}
                updateNotes={updateNotes}
              />
            </Box>
            {studentGroups.map((studentGroup, index) => (
              <GroupCard
                key={studentGroup.groupNumber}
                courseId={courseId}
                studentList={studentGroup.memberData}
                groupNumber={studentGroup.groupNumber}
                templateMap={templateNameMap}
                groupTimestamps={studentGroup.templateTimestamps}
                moveStudent={moveStudent}
                createTime={studentGroup.createTime}
                updateTime={studentGroup.updateTime}
                selected={selectedGroupNumbers.includes(
                  studentGroup.groupNumber
                )}
                selectedStudents={selectedStudents}
                handleChecked={(event) => {
                  editSelectedGroups(studentGroup, event.target.checked)
                }}
                handleAddStudent={handleAddStudent}
                updateNotes={updateNotes}
              />
            ))}
          </Box>
        </DndProvider>
      </Box>
      <Snackbar
        open={emailSent}
        autoHideDuration={6000}
        onClose={() => setEmailSent(false)}
        message="Emails delivered!"
        action={emailSentAction}
      />
      <Snackbar
        open={emailSentError}
        autoHideDuration={6000}
        onClose={() => setEmailSentError(false)}
      >
        <Alert variant="filled" severity="error">
          Emails Failed to send. Please relogin and try again.
        </Alert>
      </Snackbar>
    </Box>
  ) : showError ? (
    <Box m={6}>
      <Typography variant="h5" component="h1" align="center">
        Error: unable to edit course with id {courseId}
      </Typography>
    </Box>
  ) : (
    <Box m={6}>
      <Typography variant="h5" component="h1" align="center">
        Loading...
      </Typography>
    </Box>
  )
}
