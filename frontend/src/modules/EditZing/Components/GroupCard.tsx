import { useState } from 'react'
import StudentCard from 'EditZing/Components/StudentCard'
import { GroupGridProps } from 'EditZing/Types/ComponentProps'
import { useDrop } from 'react-dnd'
import { STUDENT_TYPE, DnDStudentTransferType } from 'EditZing/Types/Student'
import { StyledGroupText } from 'EditZing/Styles/StudentAndGroup.style'
import { Box, Tooltip, Paper, Checkbox, IconButton } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import { Delete } from '@mui/icons-material'
import axios from 'axios'
import { API_ROOT, MATCHING_API } from '@core'

/** the equivalent of Column */
const GroupCard = ({
  courseId,
  studentList,
  groupNumber,
  moveStudent,
  createTime,
  templateMap,
  groupTimestamps,
  selected,
  selectedStudents,
  handleChecked,
  handleAddStudent,
  updateNotes,
  removeGroups,
}: GroupGridProps) => {
  /**
   * Helper to format the timestamp data in a way that is helpful for displaying in tooltips
   * @param timestamps a map of template ids to their timestamps
   * @param templateMap a map from template ids to their template names
   * @return the timestamp data formatted as an alphabetically sorted array of name/timestamp pairs
   */
  const formatTooltipData = (timestamps: { [key: string]: Date }) => {
    return (
      //formats object into a sortable list
      Object.entries(timestamps)
        //get the corresponding template name from each template id
        .map(([k, v]) => ({ name: templateMap[k], timestamp: v }))
        //sort timestamps alphabetically by template name
        .sort((a, b) => a.name.localeCompare(b.name))
    )
  }

  const tooltipTimestamps = formatTooltipData(groupTimestamps)

  const [{ isOver }, drop] = useDrop({
    accept: STUDENT_TYPE,
    drop: (item: DnDStudentTransferType) => {
      moveStudent(
        item.studentToMove.email,
        courseId,
        item.groupNumber,
        groupNumber
      )
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

  const removeGroup = (courseId: string, groupNumber: number) => {
    axios.post(`${API_ROOT}${MATCHING_API}/hide-group`, {
      courseId: courseId,
      groupNumber: groupNumber,
    })
    removeGroups(courseId, groupNumber)
  }

  return (
    <Paper
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      ref={drop}
      elevation={isHovering && !selected ? 4 : 2}
      sx={{
        width: '380px',
        height: '350px',
        padding: '2rem',
        border: 0.5,
        borderColor: selected || isHovering ? 'purple.50' : 'purple.16',
        borderRadius: '20px',
        margin: '0.25rem',
        backgroundColor: selected ? 'rgba(129, 94, 212, 0.15);' : 'white',
        opacity: isOver ? '0.6' : '1',
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
        {tooltipTimestamps.map((timestamp, index) => {
          const month = timestamp.timestamp.getMonth() + 1
          const day = timestamp.timestamp.getDate()
          return (
            <Tooltip
              key={index}
              title={`${timestamp.name + ': ' + month}/${day}`}
              placement="bottom-start"
            >
              <CircleIcon sx={{ fontSize: 10 }} color="primary" />
            </Tooltip>
          )
        })}
        <Box flexGrow={2} />
        <IconButton
          color="secondary"
          sx={{
            display: studentList.length === 0 && isHovering ? 'flex' : 'none',
            backgroundColor: 'transparent',
            border: 'none',
          }}
          onClick={() => {
            if (studentList.length === 0) {
              removeGroup(courseId, groupNumber)
            }
          }}
        >
          <Delete sx={{ color: 'purple' }}></Delete>
        </IconButton>
        <Checkbox
          color="secondary"
          checked={selected}
          onChange={handleChecked}
          sx={{
            display:
              selected || (studentList.length !== 0 && isHovering)
                ? 'flex'
                : 'none',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(112px, max-content))',
          gap: '16px',
        }}
      >
        {studentList.map((student, index) => (
          <StudentCard
            key={index}
            courseId={courseId}
            groupNumber={groupNumber}
            student={student}
            templateMap={templateMap}
            selected={selectedStudents.includes(student.email)}
            handleAddStudent={handleAddStudent}
            updateNotes={updateNotes}
          />
        ))}
      </Box>
    </Paper>
  )
}

export default GroupCard
