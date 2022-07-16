import { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import { STUDENT_TYPE } from 'EditZing/Types/Student'
import { StudentGridProps } from 'EditZing/Types/ComponentProps'
import { useDrag } from 'react-dnd'
import Tooltip from '@mui/material/Tooltip'
import { Checkbox, Box, Typography, Snackbar, IconButton } from '@mui/material'
import NotesModal from './NotesModal'
import notesIcon from '@assets/img/notesIcon.png'
import filledNotesIcon from '@assets/img/filledNotes.png'

/** the equivalent of MoveableItem */
const StudentCard = ({
  courseId,
  student,
  groupNumber,
  xsSize = 6,
  handleAddStudent,
}: StudentGridProps) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: STUDENT_TYPE,
      groupNumber: groupNumber,
      studentToMove: student,
    },
    type: STUDENT_TYPE,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [isHovering, setIsHovering] = useState(false)
  const [selected, setSelected] = useState(false)
  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAddStudent(student.email, e.target.checked)
    setSelected(!selected)
  }

  const [openNotes, setOpenNotes] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notSaved, setNotSaved] = useState(false)
  const handleOpenNotes = () => setOpenNotes(true)
  const handleCloseNotes = () => setOpenNotes(false)

  const [studentNotes, setStudentNotes] = useState('')

  useEffect(() => {
    const savedNote = student.groups.find((g) => g.courseId === courseId)?.notes
    setStudentNotes(savedNote || '')
  }, [student, courseId])

  const opacity = isDragging ? '0' : '1.0'

  const submissionTime = student.groups.find(
    (groupMembership) => groupMembership.courseId === courseId
  )!.submissionTime

  return (
    <Box
      sx={{
        width: '150px',
      }}
    >
      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        message="Notes saved."
      />
      <Snackbar
        open={notSaved}
        autoHideDuration={3000}
        onClose={() => setNotSaved(false)}
        message="Notes failed to save."
        ContentProps={{
          style: {
            background: '#ff3868',
          },
        }}
      />
      <NotesModal
        open={openNotes}
        handleClose={handleCloseNotes}
        student={student}
        studentNotes={studentNotes}
        setStudentNotes={setStudentNotes}
        setSaved={setSaved}
        setNotSaved={setNotSaved}
      />
      <div ref={drag}>
        <Paper
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setIsHovering(false)}
          style={{ opacity: opacity }}
          sx={{
            padding: '11px 12px',
            background: selected ? 'rgba(213, 204, 230, .85)' : '#FBF9FF',
            border: '0.25px solid #C0AEEA',
            fontFamily: 'Montserrat',
            fontWeight: '700',
            fontSize: '14',
            boxShadow:
              isHovering && !selected
                ? '4px 4px 8px rgba(0, 0, 0, 0.3)'
                : '0px 2px 5px rgba(205, 156, 242, 0.2)',
            borderRadius: '10px',
            width: '100%',
            transition: 'box-shadow 0.1s',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'row nowrap',
              gap: '13px',
              position: 'relative',
              height: '90px',
            }}
          >
            <Box
              sx={{
                maxWidth: isHovering || selected ? '85%' : '85%',
              }}
            >
              <Tooltip
                disableFocusListener
                disableTouchListener
                title={`Requested: ${
                  submissionTime.getMonth() + 1
                }/${submissionTime.getDate()}`}
              >
                <Typography
                  sx={{
                    fontWeight: '800',
                    fontSize: '0.875rem',
                    wordBreak: 'break-word',
                  }}
                >
                  {student.name}
                </Typography>
              </Tooltip>
              <Typography sx={{ fontWeight: '400', fontSize: '0.875rem' }}>
                {student.email.replace('@cornell.edu', '')}
              </Typography>
              <Typography sx={{ fontWeight: '400', fontSize: '0.875rem' }}>
                {student.year}
              </Typography>
            </Box>

            <Checkbox
              color="secondary"
              checked={selected}
              onChange={handleChecked}
              disableRipple
              sx={{
                display: selected || isHovering ? '' : 'none',
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '1px',
                top: '1px',
              }}
            />

            <IconButton
              component="button"
              sx={{
                border: 'none',
                width: '24px',
                height: '24px',
                position: 'absolute',
                right: '1px',
                bottom: '4px',
                cursor: 'pointer',
                display: !studentNotes && isHovering ? '' : 'none',
              }}
              onClick={handleOpenNotes}
              color="secondary"
            >
              <img
                src={notesIcon}
                style={{ width: '24px', height: '24px' }}
                alt="edit student note"
              />
            </IconButton>
            <IconButton
              component="button"
              sx={{
                border: 'none',
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '0px',
                bottom: '4px',
                cursor: 'pointer',
                display: studentNotes ? '' : 'none',
              }}
              onClick={handleOpenNotes}
              color="secondary"
            >
              <img
                src={filledNotesIcon}
                style={{
                  width: '20px',
                  height: '20px',
                }}
                alt=""
              />
            </IconButton>
          </Box>
        </Paper>
      </div>
    </Box>
  )
}

export default StudentCard
