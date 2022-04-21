import React from 'react'
import { StudentGrid } from 'EditZing/Components/StudentGrid'
import Grid from '@mui/material/Grid'
import { GroupGridProps } from 'EditZing/Types/ComponentProps'
import { useDrop } from 'react-dnd'
import { STUDENT_TYPE, DnDStudentTransferType } from 'EditZing/Types/Student'
import {
  StyledGroupText,
  StyledGroupContainer,
} from 'EditZing/Styles/StudentAndGroup.style'
import { Box, Tooltip } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'

const ShareMatchEmailToolTip = ({
  month,
  day,
}: {
  month: number
  day: number
}) => {
  return (
    <Tooltip
      title={`Share matching results: Sent on ${month}/${day}`}
      placement="bottom-start"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'essentials.main',
            color: 'white',
            fontWeight: 600,
            borderRadius: '10px',
          },
        },
      }}
    >
      <CircleIcon sx={{ fontSize: 10 }} color="primary" />
    </Tooltip>
  )
}

/** the equivalent of Column */
export const GroupGrid = ({
  studentList,
  groupNumber,
  moveStudent,
  shareMatchEmailTimestamp,
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
        <Box display="flex" alignItems="center" mb={2}>
          <StyledGroupText>{`Group ${groupNumber}`}</StyledGroupText>
          {shareMatchEmailTimestamp && (
            <ShareMatchEmailToolTip
              month={shareMatchEmailTimestamp.getMonth() + 1}
              day={shareMatchEmailTimestamp.getDate()}
            />
          )}
        </Box>
        <Grid container spacing={2}>
          {studentList.map((student, index) => (
            <StudentGrid
              key={index}
              groupNumber={groupNumber}
              student={student}
            />
          ))}
        </Grid>
      </StyledGroupContainer>
    </Grid>
  )
}
