import { useState } from 'react'
import { STUDENT_TYPE } from 'EditZing/Types/Student'
import { StudentGridProps } from 'EditZing/Types/ComponentProps'
import { useDrag } from 'react-dnd'
import {
  Checkbox,
  Box,
  Tooltip,
  Typography,
  Snackbar,
  IconButton,
  SvgIcon,
  Paper,
} from '@mui/material'
import NotesModal from './NotesModal'
import { ReactComponent as FilledEditIcon } from '@assets/img/FilledEditIcon.svg'
import { ReactComponent as EditIcon } from '@assets/img/EditIcon.svg'
import CircleIcon from '@mui/icons-material/Circle'
import { Student } from '@core/Types'

/** the equivalent of MoveableItem */
const StudentCard = ({
  courseId,
  student,
  groupNumber,
  xsSize = 6,
  templateMap,
  selected,
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
  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAddStudent(student.email, e.target.checked)
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
  const saveModalNotes = async () => {
    setIsNotesSaving(true)
    try {
      await updateNotes(student.email, courseId, modalNotes)
      setShowNotesSaveSuccess(true)
    } catch (error: any) {
      setShowNotesSaveFailure(true)
    }
    setIsNotesSaving(false)
    setOpenNotesModal(false)
  }

  const opacity = isDragging ? '0' : '1.0'

  const submissionTime = student.groups.find(
    (groupMembership) => groupMembership.courseId === courseId
  )!.submissionTime

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

  //Helper to extract and format the individual timestamps from a student
  const studentToTimestamps = (s: Student) => {
    const groupMem = s.groups.find((group) => group.courseId === courseId)
    if (!groupMem) {
      throw Error(`${s.email} not found in group membership`)
    }
    return formatTooltipData(groupMem.templateTimestamps)
  }

  const tooltipTimestamps = studentToTimestamps(student)

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
          elevation={isHovering && !selected ? 3 : 1}
          sx={{
            padding: '11px 12px',
            background: selected ? 'rgba(213, 204, 230, .85)' : '#FBF9FF',
            border: '0.25px solid #C0AEEA',
            fontFamily: 'Montserrat',
            fontWeight: '700',
            fontSize: '14',
            borderRadius: '10px',
            width: '100%',
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
                    display: 'inline',
                    marginRight: '0.5rem',
                  }}
                >
                  {student.name}
                </Typography>
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
