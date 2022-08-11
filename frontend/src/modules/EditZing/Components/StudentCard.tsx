import { useState } from 'react'
import Paper from '@mui/material/Paper'
import { STUDENT_TYPE } from 'EditZing/Types/Student'
import { StudentGridProps } from 'EditZing/Types/ComponentProps'
import { useDrag } from 'react-dnd'
import Tooltip from '@mui/material/Tooltip'
import {
  Checkbox,
  Box,
  Typography,
  Snackbar,
  IconButton,
  SvgIcon,
} from '@mui/material'
import NotesModal from './NotesModal'
import { ReactComponent as FilledEditIcon } from '@assets/img/FilledEditIcon.svg'
import { ReactComponent as EditIcon } from '@assets/img/EditIcon.svg'

import axios from 'axios'
import { API_ROOT, STUDENT_API } from '@core/Constants'

/** the equivalent of MoveableItem */
const StudentCard = ({
  courseId,
  student,
  groupNumber,
  xsSize = 6,
  tooltipTimestamps,
  handleAddStudent,
  updateNotes,
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

  const studentNotes = student.groups.find((g) => g.courseId === courseId)!
    .notes
  const [modalNotes, setModalNotes] = useState(studentNotes)

  const [openNotesModal, setOpenNotesModal] = useState(false)
  const [isNotesSaving, setIsNotesSaving] = useState(false)
  const [showNotesSaveSuccess, setShowNotesSaveSuccess] = useState(false)
  const [showNotesSaveFailure, setShowNotesSaveFailure] = useState(false)
  const handleOpenNotes = () => {
    setModalNotes(studentNotes) // Reset student notes every time modal opened
    setOpenNotesModal(true)
  }
  const handleCloseNotes = () => setOpenNotesModal(false)

  // saving notes to db
  const saveModalNotes = () => {
    setIsNotesSaving(true)
    axios
      .post(`${API_ROOT}${STUDENT_API}/notes`, {
        email: student.email,
        courseId: courseId,
        notes: modalNotes,
      })
      .then(() => {
        updateNotes(student.email, modalNotes) // Share the changes to rest of the page
        setShowNotesSaveSuccess(true)
      })
      .catch(() => setShowNotesSaveFailure(true))
    setIsNotesSaving(false)
    setOpenNotesModal(false)
  }

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
        open={showNotesSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowNotesSaveSuccess(false)}
        message="Notes saved."
      />
      <Snackbar
        open={showNotesSaveFailure}
        autoHideDuration={3000}
        onClose={() => setShowNotesSaveFailure(false)}
        message="Notes failed to save."
        ContentProps={{ sx: { bgcolor: 'error.main' } }}
      />
      <NotesModal
        open={openNotesModal}
        isSaving={isNotesSaving}
        name={student.name}
        modalNotes={modalNotes}
        setModalNotes={setModalNotes}
        saveModalNotes={saveModalNotes}
        handleClose={handleCloseNotes}
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
              <SvgIcon>
                <EditIcon />
              </SvgIcon>
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
              <SvgIcon>
                <FilledEditIcon />
              </SvgIcon>
            </IconButton>
          </Box>
        </Paper>
      </div>
    </Box>
  )
}

export default StudentCard
