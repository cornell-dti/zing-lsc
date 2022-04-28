import React from 'react'
import { StudentGrid } from 'EditZing/Components/StudentGrid'
import Grid from '@mui/material/Grid'
import { GroupGridProps } from 'EditZing/Types/ComponentProps'
import { useDrop } from 'react-dnd'
import { STUDENT_TYPE, DnDStudentTransferType } from 'EditZing/Types/Student'
import {
  StyledGroupText,
  StyledGroupTextWrapper,
  StyledGroupContainer,
} from 'EditZing/Styles/StudentAndGroup.style'
import Tooltip from '@mui/material/Tooltip'

/** the equivalent of Column */
export const GroupGrid = ({
  studentList,
  groupNumber,
  moveStudent,
  createTime,
  updateTime,
}: GroupGridProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: STUDENT_TYPE,
    drop: (item: DnDStudentTransferType) => {
      moveStudent(item.studentToMove, item.groupNumber, groupNumber)
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
          {createTime && (
            <Tooltip
              disableFocusListener
              disableTouchListener
              title={
                'Created on ' +
                (createTime.getMonth() + 1) +
                '/' +
                createTime.getDate()
              }
            >
              <StyledGroupText>
                {'Group ' + String(groupNumber)}
              </StyledGroupText>
            </Tooltip>
          )}
        </StyledGroupTextWrapper>
        <Grid container spacing={2}>
          {studentList.map((student, index) => (
            <StudentGrid
              key={index}
              groupNumber={groupNumber}
              student={student}
              submissionTime={student.submissionTime}
            />
          ))}
        </Grid>
      </StyledGroupContainer>
    </Grid>
  )
}
