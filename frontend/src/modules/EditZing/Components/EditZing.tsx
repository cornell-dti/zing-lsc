import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import { GroupGrid } from 'EditZing/Components/GroupGrid'
import { UnmatchedGrid } from './UnmatchedGrid'
import { Student } from 'EditZing/Types/Student'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  CourseInfo,
  CourseInfoResponse,
  CourseStudentDataResponse,
  Group,
} from 'EditZing/Types/CourseInfo'
import { API_ROOT, COURSE_API, MATCHING_API } from '@core/Constants'
import { useParams } from 'react-router-dom'
import { EmailModal } from 'EditZing/Components/EmailModal'
import { MatchLoading } from './MatchLoading'
import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  SvgIcon,
  SvgIconProps,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material'
import { ReactComponent as Lsc } from '@assets/img/lscicon.svg'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useAuthValue } from '@auth/AuthContext'

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

  const [unmatchedStudents, setUnmatchedStudents] = useState<Student[]>([])
  const [studentGroups, setStudentGroups] = useState<Group[]>([])
  const [hasLoadedStudentData, setHasLoadedStudentData] = useState(false)
  useEffect(() => {
    axios
      .get(`${API_ROOT}${COURSE_API}/students/${courseId}`)
      .then((res: AxiosResponse<CourseStudentDataResponse>) => {
        setUnmatchedStudents(
          res.data.data.unmatched.map((student) => ({
            ...student,
            submissionTime: new Date(student.submissionTime),
          }))
        )
        setStudentGroups(
          res.data.data.groups.map((group) => ({
            ...group,
            memberData: group.memberData.map((student) => ({
              ...student,
              submissionTime: new Date(student.submissionTime),
            })),
            createTime: new Date(group.createTime),
            updateTime: new Date(group.updateTime),
            shareMatchEmailTimestamp: group.shareMatchEmailTimestamp
              ? new Date(group.shareMatchEmailTimestamp)
              : null,
            checkInEmailTimestamp: group.checkInEmailTimestamp
              ? new Date(group.checkInEmailTimestamp)
              : null,
            addStudentEmailTimestamp: group.addStudentEmailTimestamp
              ? new Date(group.addStudentEmailTimestamp)
              : null,
          }))
        )
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
          response.data.data.unmatched.map((student: any) => ({
            ...student,
            submissionTime: new Date(student.submissionTime),
          }))
        )
        const groups = studentGroups.concat(
          response.data.data.groups.map((group: Group) => ({
            ...group,
            memberData: group.memberData.map((student) => ({
              ...student,
              submissionTime: new Date(student.submissionTime),
            })),
            createTime: new Date(group.createTime),
            updateTime: new Date(group.updateTime),
            shareMatchEmailTimestamp: group.shareMatchEmailTimestamp
              ? new Date(group.shareMatchEmailTimestamp)
              : null,
            checkInEmailTimestamp: group.checkInEmailTimestamp
              ? new Date(group.checkInEmailTimestamp)
              : null,
            addStudentEmailTimestamp: group.addStudentEmailTimestamp
              ? new Date(group.addStudentEmailTimestamp)
              : null,
          }))
        )
        setStudentGroups(groups)
        setIsCurrentlyGrouping(false)
      })
      .catch((error) => displayNetworkError(error.message))
  }

  /** Handles updating the groups state when we send an email so timestamp shows directly after email is sent without requiring page refresh. */
  const handleEmailTimestamp = () => {
    axios
      .get(`${API_ROOT}${COURSE_API}/students/${courseId}`)
      .then((res: AxiosResponse<CourseStudentDataResponse>) => {
        setUnmatchedStudents(
          res.data.data.unmatched.map((student) => ({
            ...student,
            submissionTime: new Date(student.submissionTime),
          }))
        )
        setStudentGroups(
          res.data.data.groups.map((group) => ({
            ...group,
            memberData: group.memberData.map((student) => ({
              ...student,
              submissionTime: new Date(student.submissionTime),
            })),
            createTime: new Date(group.createTime),
            updateTime: new Date(group.updateTime),
            shareMatchEmailTimestamp: group.shareMatchEmailTimestamp
              ? new Date(group.shareMatchEmailTimestamp)
              : null,
            checkInEmailTimestamp: group.checkInEmailTimestamp
              ? new Date(group.checkInEmailTimestamp)
              : null,
            addStudentEmailTimestamp: group.addStudentEmailTimestamp
              ? new Date(group.addStudentEmailTimestamp)
              : null,
          }))
        )
      })
      .catch((error) => displayNetworkError(error.message))
  }

  // TODO: remove this eslint disable once selectedGroups is used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        .filter((group) => group.shareMatchEmailTimestamp === null)
        .map((group) => group.groupNumber)
    )
    handleMenuClose()
  }

  const handleSelectStudents = () => {
    setIsEmailing(true)
  }

  return courseInfo && hasLoadedStudentData ? (
    <Box
    // sx={{ maxWidth: '1440px', marginLeft: 'auto', marginRight: 'auto' }}
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
        <LscIcon sx={{ height: '50px', width: '50px' }} />
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
              <MenuItem onClick={handleSelectStudents}>
                Selected Students
              </MenuItem>
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
          <Grid container spacing={1} padding={0}>
            <UnmatchedGrid
              unmatchedStudents={unmatchedStudents}
              moveStudent={moveStudent}
              matchStudents={matchStudents}
              handleAddStudent={handleAddStudent}
            />
            {studentGroups.map((studentGroup, index) => (
              <GroupGrid
                key={studentGroup.groupNumber}
                studentList={studentGroup.memberData}
                groupNumber={studentGroup.groupNumber}
                shareMatchEmailTimestamp={studentGroup.shareMatchEmailTimestamp}
                checkInEmailTimestamp={studentGroup.checkInEmailTimestamp}
                addStudentEmailTimestamp={studentGroup.addStudentEmailTimestamp}
                moveStudent={moveStudent}
                createTime={studentGroup.createTime}
                updateTime={studentGroup.updateTime}
                selected={selectedGroupNumbers.includes(
                  studentGroup.groupNumber
                )}
                handleChecked={(event) => {
                  editSelectedGroups(studentGroup, event.target.checked)
                }}
                handleAddStudent={handleAddStudent}
              />
            ))}
          </Grid>
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
