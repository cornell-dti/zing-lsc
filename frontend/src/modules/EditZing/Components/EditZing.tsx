import React, { useState } from 'react'
import GroupCard from 'EditZing/Components/GroupCard'
import { UnmatchedGrid } from './UnmatchedGrid'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
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
import { useHistory } from 'react-router-dom'
import { DASHBOARD_PATH } from '@core/Constants'
import { useCourseValue } from '@context/CourseContext'
import { useStudentValue } from '@context/StudentContext'
import { useTemplateValue } from '@context/TemplateContext'
import { Group } from '@core/index'

const LscIcon = (props: SvgIconProps) => {
  return <SvgIcon inheritViewBox component={Lsc} {...props} />
}

export const EditZing = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const history = useHistory()
  const state = history.location.state as any
  const { courses, moveStudent, matchStudents, removeGroups } = useCourseValue()
  const { students, updateNotes } = useStudentValue()
  const { templates } = useTemplateValue()

  const course = courses.find((course) => course.courseId === courseId)

  /** Return an ordered array of Students from student emails */
  const getStudentsFromEmails = (emails: string[]) =>
    emails.map((email) => students.find((student) => student.email === email)!)

  const unmatchedStudents = getStudentsFromEmails(course?.unmatched ?? [])
  const studentGroups = course?.groups ?? []
  const copyStudentGroups: Group[] = [...studentGroups]
  copyStudentGroups.sort((a, b) => a.groupNumber - b.groupNumber)

  const [isEmailing, setIsEmailing] = useState<boolean>(false)

  /*  Snackbars  */
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [emailSentError, setEmailSentError] = useState<boolean>(false)
  const [emailSaved, setEmailSaved] = useState<boolean>(false)
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

  const [selectedStudentEmails, setSelectedStudentEmails] = useState<string[]>(
    []
  )
  const editSelectedStudentEmails = (
    studentEmail: string,
    selected: boolean
  ) => {
    if (selected) {
      setSelectedStudentEmails((arr) => [...arr, studentEmail])
    } else {
      setSelectedStudentEmails(
        selectedStudentEmails.filter((item) => item !== studentEmail)
      )
    }
  }

  const [selectedGroupNumbers, setSelectedGroupNumbers] = useState<number[]>([])
  const editSelectedGroupNumbers = (groupNumber: number, selected: boolean) => {
    if (selected) {
      setSelectedGroupNumbers([...selectedGroupNumbers, groupNumber])
    } else {
      setSelectedGroupNumbers(
        selectedGroupNumbers.filter((g) => g !== groupNumber)
      )
    }
  }

  //Map for getting the names of templates based on ID for rendering tooltips
  const templateNameMap = Object.fromEntries(
    templates.map((template) => [template.id, template.name])
  )

  const [showMatchLoading, setShowMatchLoading] = useState(false)
  const [isCurrentlyGrouping, setIsCurrentlyGrouping] = useState(false)

  /** called by the match button to match the unmatched students */
  const handleMatchStudents = () => {
    setShowMatchLoading(true)
    setIsCurrentlyGrouping(true)
    matchStudents(courseId)
      .then(() => setIsCurrentlyGrouping(false))
      .catch((error) => console.error(error))
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
    setSelectedStudentEmails(
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

  return course ? (
    <Box
      sx={{
        paddingBottom: '100px',
      }}
    >
      {isEmailing && (
        <EmailModal
          selectedGroupNumbers={selectedGroupNumbers}
          selectedStudentEmails={selectedStudentEmails}
          isEmailing={isEmailing}
          setIsEmailing={setIsEmailing}
          setEmailSent={setEmailSent}
          setEmailSentError={setEmailSentError}
          setEmailSaved={setEmailSaved}
          courseNames={course.names}
        />
      )}
      <MatchLoading
        showMatchLoading={showMatchLoading}
        isCurrentlyGrouping={isCurrentlyGrouping}
        numberGrouping={unmatchedStudents.length}
        courseNames={course.names}
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
          to={{
            pathname: DASHBOARD_PATH,
            state: {
              sortedOrder: state?.sortedOrder
                ? state.sortedOrder
                : 'newest-requests-first',
              filterOption: state?.filterOption
                ? state.filterOption
                : 'no-filter',
            },
          }}
          sx={{
            border: 'none',
          }}
          disableRipple
          disableFocusRipple
        >
          <LscIcon sx={{ height: '50px', width: '50px' }} />
        </IconButton>
        <Typography variant="h4" component="h1">
          {course.names.join(', ')} ({course.roster})
        </Typography>
        <Box flexGrow={2} />
        {selectedGroupNumbers.length === 0 &&
        selectedStudentEmails.length === 0 ? (
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
              selectedGroupNumbers.length > 0 &&
              selectedStudentEmails.length > 0
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
                handleMatchStudents={handleMatchStudents}
                templateMap={templateNameMap}
                selectedStudents={selectedStudentEmails}
                handleAddStudent={editSelectedStudentEmails}
                updateNotes={updateNotes}
              />
            </Box>
            {copyStudentGroups
              .filter((e) => !e.hidden)
              .map((studentGroup) => (
                <GroupCard
                  key={studentGroup.groupNumber}
                  courseId={courseId}
                  groupId={studentGroup.groupId}
                  studentList={getStudentsFromEmails(studentGroup.members)}
                  groupNumber={studentGroup.groupNumber}
                  templateMap={templateNameMap}
                  groupTimestamps={studentGroup.templateTimestamps}
                  moveStudent={moveStudent}
                  createTime={studentGroup.createTime}
                  updateTime={studentGroup.updateTime}
                  selected={selectedGroupNumbers.includes(
                    studentGroup.groupNumber
                  )}
                  selectedStudents={selectedStudentEmails}
                  handleChecked={(event) => {
                    editSelectedGroupNumbers(
                      studentGroup.groupNumber,
                      event.target.checked
                    )
                  }}
                  handleAddStudent={editSelectedStudentEmails}
                  updateNotes={updateNotes}
                  removeGroups={removeGroups}
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
      <Snackbar
        open={emailSaved}
        autoHideDuration={6000}
        onClose={() => setEmailSaved(false)}
      >
        <Alert variant="filled" severity="success">
          Email Saved
        </Alert>
      </Snackbar>
    </Box>
  ) : (
    <Box m={6}>
      <Typography variant="h5" component="h1" align="center">
        Error: unable to edit course with id {courseId}
      </Typography>
    </Box>
  )
}
