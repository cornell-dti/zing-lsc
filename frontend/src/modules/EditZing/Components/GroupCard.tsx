import { useState } from 'react'
import StudentCard from 'EditZing/Components/StudentCard'
import { GroupGridProps } from 'EditZing/Types/ComponentProps'
import { useDrop } from 'react-dnd'
import { STUDENT_TYPE, DnDStudentTransferType } from 'EditZing/Types/Student'
import { StyledGroupText } from 'EditZing/Styles/StudentAndGroup.style'
import { Box, Tooltip, Checkbox } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'

/** the equivalent of Column */
const GroupCard = ({
  courseId,
  studentList,
  groupNumber,
  moveStudent,
  createTime,
  updateTime,
  shareMatchEmailTimestamp,
  checkInEmailTimestamp,
  addStudentEmailTimestamp,
  selected,
  handleChecked,
  handleAddStudent,
  updateNotes,
}: GroupGridProps) => {
  const tooltips = [
    {
      type: shareMatchEmailTimestamp,
      text: 'Shared match results: ',
    },
    {
      type: checkInEmailTimestamp,
      text: 'Checked in: ',
    },
    {
      type: addStudentEmailTimestamp,
      text: 'Requested student add: ',
    },
  ]

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
    <Box>
      <Box
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        ref={drop}
        sx={{
          width: '380px',
          height: '350px',
          padding: '2rem',
          border: 0.5,
          borderColor: selected || isHovering ? 'purple.50' : 'purple.16',
          boxShadow:
            !selected && isHovering
              ? '4px 4px 10px rgba(0, 0, 0, 0.3)'
              : '0px 4px 10px rgba(0, 0, 0, 0.07)',
          borderRadius: '20px',
          margin: '0.25rem',
          backgroundColor: selected ? 'rgba(129, 94, 212, 0.15);' : 'white',
          opacity: isOver ? '0.6' : '1',
          transition: 'box-shadow 0.1s',
        }}
      >
        <Box display="flex" alignItems="center" sx={{ mb: 2, height: '42px' }}>
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
          {tooltips.map((timestamp, index) => {
            if (timestamp.type) {
              const month = timestamp.type.getMonth() + 1
              const day = timestamp.type.getDate()
              return (
                <Tooltip
                  key={index}
                  title={`${timestamp.text + month}/${day}`}
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
            return null
          })}
          <Box flexGrow={2} />
          <Checkbox
            color="secondary"
            checked={selected}
            onChange={handleChecked}
            sx={{
              display: selected || isHovering ? 'flex' : 'none',
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(112px, max-content))',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          {studentList.map((student, index) => (
            <StudentCard
              key={index}
              courseId={courseId}
              groupNumber={groupNumber}
              student={student}
              handleAddStudent={handleAddStudent}
              updateNotes={updateNotes}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default GroupCard
