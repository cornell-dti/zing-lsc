import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import {
  StyledContainer,
  StyledLogo,
  StyledLogoWrapper,
  StyledText,
} from 'EditZing/Styles/EditZing.style'
import { GroupGrid } from 'EditZing/Components/GroupGrid'
import { Student } from 'EditZing/Types/Student'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const EditZing = () => {
  const fakeStudentGroupsFromJson: Student[][] = require('EditZing/fakeData.json')
  const [studentGroups, setStudentGroups] = useState(fakeStudentGroupsFromJson)

  /** Move a student from one grid to a destination grid based
   * on a starting and destination grid index */
  function moveStudentBetweenGrids(
    studentToMove: Student,
    startingIndex: number,
    destinationIndex: number
  ): void {
    // only set new groups if actually changing index
    if (startingIndex !== destinationIndex) {
      setStudentGroups(
        studentGroups.map((studentList, index) => {
          // case where the current iterated group is the starting index
          if (index === startingIndex) {
            // filter for only students with IDs that are not the studentToMove's
            return studentGroups[startingIndex].filter(
              (student) => student.studentId !== studentToMove.studentId
            )
          }
          // case where the current iterated group is the destination index
          else if (index === destinationIndex) {
            /* based on how drop functions work, we need to first check if the 
          destination group has the studentToMove in it first and skip it 
          if it already contains it */
            if (!studentGroups[destinationIndex].includes(studentToMove)) {
              return studentGroups[destinationIndex].concat(studentToMove)
            } else {
              return studentList
            }
          }
          // case where it is neither starting nor destination
          else {
            return studentList
          }
        })
      )
    }
  }

  /** This function rearranges a student within the grid it is currently in */
  function moveStudentWithinGrid(
    studentToMove: Student,
    currentGroupIndex: number,
    destinationStudentIndex: number
  ): void {
    let groups = [...studentGroups]
    if (groups[currentGroupIndex].includes(studentToMove)) {
      groups[currentGroupIndex] = groups[currentGroupIndex].filter(
        (student) => student.studentId !== studentToMove.studentId
      )
    }
    groups[currentGroupIndex].splice(destinationStudentIndex, 0, studentToMove)
    setStudentGroups(groups)
  }

  // TODO: COURSE SHOULDN'T BE HARDCODED
  return (
    <StyledContainer>
      <StyledLogoWrapper>
        <StyledLogo />
        <StyledText>ZING 1100</StyledText>
      </StyledLogoWrapper>
      <DndProvider backend={HTML5Backend}>
        <Grid container spacing={1}>
          {studentGroups.map((studentGroup, index) => (
            <GroupGrid
              key={index}
              studentList={studentGroup}
              groupIndex={index}
              moveStudentBetweenGrids={moveStudentBetweenGrids}
              moveStudentWithinGrid={moveStudentWithinGrid}
            />
          ))}
        </Grid>
      </DndProvider>
    </StyledContainer>
  )
}
