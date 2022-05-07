import React, { useState } from 'react'
import { StudentGrid } from 'EditZing/Components/StudentGrid'
import { GroupGridProps } from 'EditZing/Types/ComponentProps'
import { useDrop } from 'react-dnd'
import { STUDENT_TYPE, DnDStudentTransferType } from 'EditZing/Types/Student'
import {
  StyledGroupText,
  StyledGroupContainer,
} from 'EditZing/Styles/StudentAndGroup.style'
import { Box, Tooltip, Grid, Checkbox } from '@mui/material'
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
  createTime,
  updateTime,
  shareMatchEmailTimestamp,
  selected,
  handleChecked,
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

  const [isHovering, setIsHovering] = useState(false)
  const handleMouseOver = () => {
    setIsHovering(true)
  }

  const handleMouseOut = () => {
    setIsHovering(false)
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        ref={drop}
        sx={{
          padding: '2rem',
          border: "0.5px solid 'purple.50'",
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.07)',
          borderRadius: '20px',
          margin: '0.25rem',
          backgroundColor: selected ? 'rgba(129, 94, 212, 0.15);' : 'white',
          opacity: isOver ? '0.6' : '1',
        }}
      >
        <Box
          display="flex"
          flex-direction="row-reverse"
          alignItems="center"
          mb={2}
          sx={{ width: '100%', height: '100%' }}
        >
          <Tooltip
            title={
              'Created on ' +
              (createTime.getMonth() + 1) +
              '/' +
              createTime.getDate()
            }
          >
            <StyledGroupText>{`Group ${groupNumber}`}</StyledGroupText>
          </Tooltip>
          {shareMatchEmailTimestamp && (
            <ShareMatchEmailToolTip
              month={shareMatchEmailTimestamp.getMonth() + 1}
              day={shareMatchEmailTimestamp.getDate()}
            />
          )}

          <Checkbox
            color="secondary"
            align-self="flex-end"
            checked={selected}
            onChange={handleChecked}
            sx={{
              display: selected || isHovering ? 'block' : 'none',
              padding: '0px',
              ml: '45%',
            }}
          />
        </Box>
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
      </Box>
    </Grid>
  )
}
