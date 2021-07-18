import React from 'react'
import { StudentGrid } from 'EditZing/Components/StudentGrid'
import Grid, { GridSize } from '@material-ui/core/Grid'
import { UnmatchedGridProps } from 'EditZing/Types/ComponentProps'
import {
  StyledGroupText,
  StyledGroupTextWrapper,
  StyledUnmatchedContainer,
} from 'EditZing/Styles/StudentAndGroup.style'

/** Where unmatched students live in the grid */
export const UnmatchedGrid = ({ unmatchedStudents }: UnmatchedGridProps) => {
  const xsSize: GridSize = 1

  return (
    <Grid item xs={12}>
      <StyledUnmatchedContainer>
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
