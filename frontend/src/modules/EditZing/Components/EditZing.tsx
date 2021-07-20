import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import {
  StyledContainer,
  StyledLogo,
  StyledLogoWrapper,
  StyledText,
} from 'EditZing/Styles/EditZing.style'
import { GroupGrid } from 'EditZing/Components/GroupGrid'
import { UnmatchedGrid } from './UnmatchedGrid'
import { Student } from 'EditZing/Types/Student'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  CourseInfo,
  CourseStudentDataResponse,
} from 'EditZing/Types/CourseInfo'

export const EditZing = () => {
  const fakeCourseInfoFromJson: CourseInfo = require('EditZing/courseInfo.json')
  const [courseInfo, setCourseInfo] = useState(fakeCourseInfoFromJson)

  const fakeResponse: CourseStudentDataResponse = require('EditZing/studentData.json')
  const [unmatchedStudents, setUnmatchedStudents] = useState(
    fakeResponse.data.unmatched
  )
  const [studentGroups, setStudentGroups] = useState(fakeResponse.data.groups)

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
      } else {
        moveStudentIntergroup(student, fromGroupNumber, toGroupNumber)
      }
    }
  }

  // TODO: COURSE SHOULDN'T BE HARDCODED
  return (
    <StyledContainer>
      <StyledLogoWrapper>
        <StyledLogo />
        <StyledText>{courseInfo.names.join(', ')}</StyledText>
      </StyledLogoWrapper>
      <DndProvider backend={HTML5Backend}>
        <Grid container spacing={1}>
          <UnmatchedGrid unmatchedStudents={unmatchedStudents} />
          {studentGroups.map((studentGroup, index) => (
            <GroupGrid
              key={index}
              studentList={studentGroup.memberData}
              groupNumber={studentGroup.groupNumber}
              moveStudent={moveStudent}
            />
          ))}
        </Grid>
      </DndProvider>
    </StyledContainer>
  )
}
