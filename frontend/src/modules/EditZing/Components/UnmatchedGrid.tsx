import React from 'react'
import { StudentGrid } from 'EditZing/Components/StudentGrid'
import Grid, { GridSize } from '@mui/material/Grid'
import { UnmatchedGridProps } from 'EditZing/Types/ComponentProps'
import {
  StyledUnmatchedContainer,
  StyledUnmatchedTextWrapper,
  StyledUnmatchedText,
} from 'EditZing/Styles/StudentAndGroup.style'
import { useDrop } from 'react-dnd'
import { DnDStudentTransferType, STUDENT_TYPE } from 'EditZing/Types/Student'
import { MatchButton } from './MatchButton'

/** Where unmatched students live in the grid */
export const UnmatchedGrid = ({
  unmatchedStudents,
  moveStudent,
  matchStudents,
}: UnmatchedGridProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: STUDENT_TYPE,
    drop: (item: DnDStudentTransferType) => {
      moveStudent(item.studentToMove, item.groupNumber, -1)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })
  const xsSize: GridSize = 1

  return (
    <Grid item xs={12}>
      <StyledUnmatchedContainer
        ref={drop}
        style={{ opacity: isOver ? '0.6' : '1' }}
      >
        <StyledUnmatchedTextWrapper>
          <StyledUnmatchedText>
            Unmatched Students ({unmatchedStudents.length})
          </StyledUnmatchedText>
          <MatchButton label="Match" onClick={matchStudents} />
        </StyledUnmatchedTextWrapper>
        <Grid container spacing={2}>
          {unmatchedStudents.map((student, index) => (
            <StudentGrid
              key={index}
              groupNumber={-1}
              student={student}
              xsSize={xsSize}
              submissionTime={student.submissionTime}
            />
          ))}
        </Grid>
      </StyledUnmatchedContainer>
    </Grid>
  )
}
