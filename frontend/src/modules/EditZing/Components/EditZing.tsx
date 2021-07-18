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
import { CourseInfo, Group } from 'EditZing/Types/CourseInfo'

export const EditZing = () => {
  const fakeCourseInfoFromJson: CourseInfo = require('EditZing/courseInfo.json')
  const [courseInfo, setCourseInfo] = useState(fakeCourseInfoFromJson)

  const fakeStudentGroupsFromJson: Group[] = require('EditZing/groups.json')
  const [studentGroups, setStudentGroups] = useState(fakeStudentGroupsFromJson)

  /** Add an unmatched student to a group */
  const moveStudentFromUnmatched = (student: string, toGroupNumber: number) => {
    setCourseInfo({
      ...courseInfo,
      unmatched: courseInfo.unmatched.filter((s) => s !== student),
    })
    setStudentGroups(
      studentGroups.map((group) =>
        group.groupNumber === toGroupNumber
          ? { ...group, members: [...group.members, student] }
          : group
      )
    )
  }

  /** Transfer a student from a group to another group */
  const moveStudentIntergroup = (
    student: string,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => {
    setStudentGroups(
      studentGroups.map((group) =>
        group.groupNumber === toGroupNumber
          ? { ...group, members: [...group.members, student] }
          : group.groupNumber === fromGroupNumber
          ? { ...group, members: group.members.filter((s) => s !== student) }
          : group
      )
    )
  }

  /** Move a student from some group (existing/unmatched) to a group */
  const moveStudent = (
    student: string,
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
          <UnmatchedGrid unmatchedStudents={courseInfo.unmatched} />
          {studentGroups.map((studentGroup, index) => (
            <GroupGrid
              key={index}
              studentList={studentGroup.members}
              groupNumber={studentGroup.groupNumber}
              moveStudent={moveStudent}
            />
          ))}
        </Grid>
      </DndProvider>
    </StyledContainer>
  )
}
