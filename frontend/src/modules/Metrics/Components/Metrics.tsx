import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { ReactComponent as LogoImg } from '@assets/img/lscicon.svg'
import { useCourseValue } from '@context/CourseContext'
import { useStudentValue } from '@context/StudentContext'
import { AccountMenu } from 'Dashboard/Components/AccountMenu'
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

  const allStudents =
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
            }
          })
        )
      : []
  const getUniqueValues = (arr: any) =>
    arr.filter(
      (value: any, index: any, self: string | any[]) =>
        self.indexOf(value) === index
    )
  const [selectedRoster, setSelectedRoster] = useState<string>('FA22')
  const chosenSemesterStudents = allStudents.filter(
    (e) => e.semester === selectedRoster
  )
  const collegeNames = getUniqueValues(allStudents.map((s) => s.college))

  const calculateStats = (college: string) => {
    const specificCollegeStudents = chosenSemesterStudents.filter(
      (s) => s.college === college
    )
    const uniqueStudents = getUniqueValues(
      specificCollegeStudents.map((s) => s.name)
    )
    const matches = specificCollegeStudents.reduce(
      (total, student) => (student?.groupNumber ? total + 1 : total),
      0
    )
    const createdGroups = specificCollegeStudents.filter((student) => {
      return student.groupNumber !== undefined
    })
    const groups = getUniqueValues(createdGroups.map((s) => s.groupNumber))
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
    <Box>
      <Box>
        <LogoImg />
        <Link href="/dashboard" underline="none">
          Dashboard
        </Link>
        <AccountMenu
          selectedRoster={selectedRoster}
          setSelectedRoster={setSelectedRoster}
        ></AccountMenu>
      </Box>
      <Box>Overall</Box>
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
        <Box>By College</Box>
        <DropdownSelect
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
        data={collegeNames.map((college: string) => calculateStats(college))}
      />
    </Box>
  )
}