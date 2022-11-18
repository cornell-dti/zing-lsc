import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { ReactComponent as LogoImg } from '@assets/img/lscicon.svg'
import { useCourseValue } from '@context/CourseContext'
import { useStudentValue } from '@context/StudentContext'
import { AccountMenu } from 'Dashboard/Components/AccountMenu'
import {
  StyledContainer,
  StyledHeaderMenu,
  StyledName,
} from '../Styles/Metrics.style'
import { Box, Link, SelectChangeEvent } from '@mui/material'
import { StatGrid } from './StatGrid'
import { MetricsTable } from './MetricsTable'
import { DropdownSelect } from '@core/Components'

export const Metrics = () => {
  const { courses } = useCourseValue()
  const { students } = useStudentValue()

  //calculate number of unique students who have made requests
  const num_students = {
    number: students.length,
    title: 'unique students',
    subtitle: 'made requests',
  }

  //calculate number of unique courses that have received requests
  const num_courses = {
    number: courses.length,
    title: 'courses',
    subtitle: 'received requests',
  }

  //calculate total number of requests made by students
  const num_requests = {
    number: students.reduce(
      (total, student) => total + student.groups.length,
      0
    ),
    title: 'requests',
    subtitle: 'made in total',
  }

  //calculate number of students matched into groups
  const num_matches = {
    number: courses.reduce(
      (courseTotal, course) =>
        courseTotal +
        course.groups.reduce(
          (groupTotal, group) => groupTotal + group.members.length,
          0
        ),
      0
    ),
    title: 'matches',
    subtitle: 'made in total',
  }

  //calculate number of students matched into groups
  const num_groups = {
    number: courses.reduce((total, course) => total + course.groups.length, 0),
    title: 'groups',
    subtitle: 'successfully made',
  }
  const stats = [
    num_students,
    num_courses,
    num_requests,
    num_matches,
    num_groups,
  ]

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

  const [selectedRoster, setSelectedRoster] = useState<string>('FA22')
  const chosenSemesterStudents = csvStudents.filter(
    (e) => e.semester === selectedRoster
  )
  const collegeNames = csvStudents
    .map((s) => s.college)
    .filter((value, index, self) => self.indexOf(value) === index)

  const calculateStats = (college: string) => {
    const specificCollegeStudents = chosenSemesterStudents.filter(
      (s) => s.college === college
    )
    const uniqueStudents = specificCollegeStudents
      .map((s) => s.name)
      .filter((value, index, self) => self.indexOf(value) === index)
    const matches = specificCollegeStudents.reduce(
      (total, student) => (student?.groupNumber ? total + 1 : total),
      0
    )
    const createdGroups = specificCollegeStudents.filter((student) => {
      return student.groupNumber !== undefined
    })
    const groups = createdGroups
      .map((s) => s.groupNumber)
      .filter((value, index, self) => self.indexOf(value) === index)
    return {
      rowName: college,
      students: uniqueStudents.length,
      requests: specificCollegeStudents.length,
      matches: matches,
      groups: groups.length,
    }
  }
  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSelectedRoster(event.target.value)
  }

  return (
    <StyledContainer>
      <StyledHeaderMenu>
        <LogoImg />
        <Link href="/dashboard" underline="none">
          Dashboard
        </Link>
        <AccountMenu
          selectedRoster={selectedRoster}
          setSelectedRoster={setSelectedRoster}
        ></AccountMenu>
      </StyledHeaderMenu>
      <StyledName>Overall</StyledName>
      <StatGrid stats={stats} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          pl: '2rem',
          pr: '2rem',
        }}
      >
        <StyledName>By College</StyledName>
        <DropdownSelect
          size="small"
          value={selectedRoster}
          onChange={handleSemesterChange}
          sx={{
            fontWeight: 'bold',
            alignSelf: 'flex-end',
          }}
        >
          <MenuItem value="SU22">Summer 2022</MenuItem>
          <MenuItem value="FA22">Fall 2022</MenuItem>
          <MenuItem value="WI22">Winter 2022</MenuItem>
          <MenuItem value="SP23">Spring 2023</MenuItem>
        </DropdownSelect>
      </Box>
      <MetricsTable
        data={collegeNames.map((college) => calculateStats(college))}
      />
    </StyledContainer>
  )
}
