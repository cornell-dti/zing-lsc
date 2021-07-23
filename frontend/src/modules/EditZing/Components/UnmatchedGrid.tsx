import React from 'react'
import { StudentGrid } from 'EditZing/Components/StudentGrid'
import Grid, { GridSize } from '@material-ui/core/Grid'
import { UnmatchedGridProps } from 'EditZing/Types/ComponentProps'
import {
  StyledGroupText,
  StyledGroupTextWrapper,
  StyledUnmatchedContainer,
} from 'EditZing/Styles/StudentAndGroup.style'
import { useDrop } from 'react-dnd'
import { DnDStudentTransferType, STUDENT_TYPE } from 'EditZing/Types/Student'

/** Where unmatched students live in the grid */
export const UnmatchedGrid = ({
  unmatchedStudents,
  moveStudent,
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
        <StyledGroupTextWrapper>
          <StyledGroupText>
            Unmatched Students ({unmatchedStudents.length})
          </StyledGroupText>
        </StyledGroupTextWrapper>
        <Grid container spacing={2}>
          {unmatchedStudents.map((student, index) => (
            <StudentGrid
              key={index}
              groupNumber={-1}
              student={student}
              xsSize={xsSize}
            />
          ))}
        </Grid>
      </StyledUnmatchedContainer>
    </Grid>
  )
}
