import React, { Dispatch, SetStateAction, useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { KeyboardArrowDown } from '@mui/icons-material'
import { logOut } from '@fire'
import { useAuthValue } from '@auth'
import { Box } from '@mui/material'
import { useCourseValue } from '@context/CourseContext'
import { useStudentValue } from '@context/StudentContext'
import { CSVLink } from 'react-csv'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Link } from 'react-router-dom'

export const AccountMenu = ({
  selectedRoster,
  setSelectedRoster,
  showMetricsLink,
  showDashboardLink,
  showSettingsLink,
}: AccountMenuProps) => {
  const { user } = useAuthValue()
  const { courses } = useCourseValue()
  const { students } = useStudentValue()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const csvCourses = courses.map((course) => ({
    semester: course.roster,
    course: course.names.join('/'),
  }))

  //this can be removed if there is a place to store an objectMap() function
  const localeMap = (obj: { [key: string]: Date } | undefined) => {
    if (!obj) {
      return undefined
    }
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, v.toLocaleString()])
    )
  }

  const csvStudents =
    courses.length && students.length // Just making sure this isn't calculated until the data is available
      ? students.flatMap((student) =>
          student.groups.map((membership) => {
            const course = courses.find(
              (c) => c.courseId === membership.courseId
            )!
            const group = course.groups.find(
              // undefined if student is unmatched
              (g) => g.groupNumber === membership.groupNumber
            )
            return {
              semester: course.roster,
              dateRequested: membership.submissionTime.toLocaleString(),
              cornellEmail: student.email,
              name: student.name,
              college: student.college,
              year: student.year,
              course: course.names.join('/'),
              groupNumber:
                membership.groupNumber !== -1
                  ? `${course.names.join('/')}_${membership.groupNumber}`
                  : undefined,
              ...localeMap(group?.templateTimestamps),
              ...localeMap(membership.templateTimestamps),
              notes: membership.notes.replace(/(\n)/gm, '  ').trim(),
            }
          })
        )
      : []

  const [rostorAnchorEl, setRosterAnchorEl] = useState<null | HTMLElement>(null)
  const openRoster = Boolean(rostorAnchorEl)
  const handleRosterClick = (event: React.MouseEvent<HTMLElement>) => {
    setRosterAnchorEl(event.currentTarget)
  }
  const handleRosterClose = () => {
    setRosterAnchorEl(null)
  }
  return (
    <Box>
      <Button
        id="logout-button"
        aria-controls="logout-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        variant="text"
        disableRipple
      >
        {user?.displayName}
      </Button>
      <Menu
        id="logout-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'logout-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <CSVLink
          data={csvCourses.filter((e) => e.semester === selectedRoster)}
          filename={`export-courses-${Date.now()}`}
        >
          <MenuItem>Export CSV (Courses)</MenuItem>
        </CSVLink>
        <CSVLink
          data={csvStudents.filter((e) => e.semester === selectedRoster)}
          filename={`export-students-${Date.now()}`}
        >
          <MenuItem>Export CSV (Students)</MenuItem>
        </CSVLink>
        <MenuItem onClick={handleRosterClick}>
          <ChevronLeftIcon sx={{ color: 'essentials.75', ml: -1 }} />
          Switch Semester
        </MenuItem>
        {showMetricsLink && (
          <MenuItem component={Link} to="/metrics">
            Metrics
          </MenuItem>
        )}
        {showDashboardLink && (
          <MenuItem component={Link} to="/">
            Dashboard
          </MenuItem>
        )}
        {showSettingsLink && (
          <MenuItem component={Link} to="/dashboard/settings">
            Settings
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleClose()
            logOut()
          }}
        >
          Log Out
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={rostorAnchorEl}
        open={openRoster}
        onClick={handleRosterClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: -1.5,
        }}
      >
        <MenuItem onClick={() => setSelectedRoster('SU22')}>
          Summer 2022
        </MenuItem>
        <MenuItem onClick={() => setSelectedRoster('FA22')}>Fall 2022</MenuItem>
        <MenuItem onClick={() => setSelectedRoster('WI23')}>
          Winter 2023
        </MenuItem>
        <MenuItem onClick={() => setSelectedRoster('SP23')}>
          Spring 2023
        </MenuItem>
        <MenuItem onClick={() => setSelectedRoster('SU23')}>
          Summer 2023
        </MenuItem>
      </Menu>
    </Box>
  )
}

interface AccountMenuProps {
  selectedRoster: string
  setSelectedRoster: Dispatch<SetStateAction<string>>
  showMetricsLink: boolean
  showDashboardLink: boolean
  showSettingsLink: boolean
}
