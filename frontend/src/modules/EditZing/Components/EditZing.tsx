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
} from '@mui/material'
import { ReactComponent as Lsc } from '@assets/img/lscicon.svg'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'

const LscIcon = (props: SvgIconProps) => {
  return <SvgIcon inheritViewBox component={Lsc} {...props} />
}

export const EditZing = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const [showError, setShowError] = useState(false)

  const [courseInfo, setCourseInfo] = useState<CourseInfo>()
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
      .catch((err) => console.error(err))
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
      .catch((err) => console.error(err))
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
      .catch((err) => console.error(err))
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
          }))
        )
        setStudentGroups(groups)
        setIsCurrentlyGrouping(false)
      })
      .catch((err) => {
        console.error(err)
        setShowError(true)
      })
  }

  // TODO: remove this eslint disable once selectedGroups is used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectedGroups = studentGroups.filter((group) =>
    selectedGroupNumbers.includes(group.groupNumber)
  )

  // Open and close the 'Send email to' menu drop down
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return courseInfo && hasLoadedStudentData ? (
    <Box>
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
          {courseInfo.names.join(', ')}
        </Typography>
        <Box flexGrow={2} />
        {selectedGroupNumbers.length === 0 ? (
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
              <MenuItem>Newly Matched</MenuItem>
            </Menu>
          </>
        ) : (
          <Button>Email Selected</Button>
        )}
      </Box>

      <Box m={6}>
        <DndProvider backend={HTML5Backend}>
          <Grid container spacing={1} padding={0}>
            <UnmatchedGrid
              unmatchedStudents={unmatchedStudents}
              moveStudent={moveStudent}
              matchStudents={matchStudents}
            />
            {studentGroups.map((studentGroup, index) => (
              <GroupGrid
                key={studentGroup.groupNumber}
                studentList={studentGroup.memberData}
                groupNumber={studentGroup.groupNumber}
                shareMatchEmailTimestamp={studentGroup.shareMatchEmailTimestamp}
                moveStudent={moveStudent}
                createTime={studentGroup.createTime}
                updateTime={studentGroup.updateTime}
                selected={selectedGroupNumbers.includes(
                  studentGroup.groupNumber
                )}
                handleChecked={(event) => {
                  editSelectedGroups(studentGroup, event.target.checked)
                }}
              />
            ))}
          </Grid>
        </DndProvider>
      </Box>
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
