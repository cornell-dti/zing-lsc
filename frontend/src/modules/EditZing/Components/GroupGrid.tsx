import React from 'react'
import { StudentGrid } from 'EditZing/Components/StudentGrid'
import Grid from '@material-ui/core/Grid'
import { GroupGridProps } from 'EditZing/Types/ComponentProps'
import { useDrop } from 'react-dnd'
import { STUDENT_TYPE, DnDStudentTransferType } from 'EditZing/Types/Student'
import {
  StyledGroupText,
  StyledGroupTextWrapper,
  StyledGroupContainer,
  StyledMetricBox,
  StyledMetricText,
} from 'EditZing/Styles/StudentAndGroup.style'

/** the equivalent of Column */
export const GroupGrid = ({
  studentList,
  groupIndex,
  moveStudentBetweenGrids,
  moveStudentWithinGrid,
}: GroupGridProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: STUDENT_TYPE,
    drop: (item: DnDStudentTransferType) => {
      moveStudentBetweenGrids(item.studentToMove, item.groupIndex, groupIndex)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <StyledGroupContainer
        ref={drop}
        style={{ opacity: isOver ? '0.6' : '1' }}
      >
        <StyledGroupTextWrapper>
          <StyledGroupText>{'Group ' + String(groupIndex + 1)}</StyledGroupText>
          <StyledMetricBox>
            <StyledMetricText>6.9</StyledMetricText>
          </StyledMetricBox>
        </StyledGroupTextWrapper>
        <Grid container spacing={2}>
          {studentList.map((student, index) => (
            <StudentGrid
              key={index}
              moveStudentWithinGrid={moveStudentWithinGrid}
              studentIndex={index}
              groupIndex={groupIndex}
              student={student}
            />
          ))}
        </Grid>
      </StyledGroupContainer>
    </Grid>
  )
}
