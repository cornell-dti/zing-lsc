import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Modal,
  Box,
  Button,
  Typography,
  OutlinedInput,
  IconButton,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'

import { API_ROOT } from '@core/Constants'
import axios from 'axios'
import { GroupMembership } from 'EditZing/Types/Student'

const NotesModal = (props: any) => {
  const { courseId } = useParams<{ courseId: string }>()
  const {
    open,
    student,
    studentNotes,
    setStudentNotes,
    handleClose,
    setSaved,
    setNotSaved,
  } = props
  const [saving, setSaving] = useState(false)
  const [localVal, setLocalVal] = useState('')
  const email = student.email

  // getting notes for student
  useEffect(() => {
    const savedNote = student.groups.find(
      (g: GroupMembership) => g.courseId === courseId
    ).notes
    setLocalVal(savedNote)
  }, [studentNotes, setStudentNotes, courseId, student])

  // saving notes to db
  const handleSave = async () => {
    setSaving(true)
    await axios
      .post(`${API_ROOT}/student/notes`, {
        email: email,
        courseId: courseId,
        notes: localVal,
      })
      .then(() => {
        setSaved(true)
        setStudentNotes(localVal)
      })
      .catch(() => setNotSaved(true))
    setSaving(false)
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        sx={{
          background: '#fff',
          width: '600px',
          display: 'flex',
          alignItems: 'center',
          flexFlow: 'column nowrap',
          gap: '21px',
          padding: '40px',
          borderRadius: '15px',
          margin: '25px',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography variant="h4" sx={{ width: '100%', fontWeight: '500' }}>
            Notes for {student.name}
          </Typography>
          <IconButton
            sx={{
              padding: '5px',
              margin: '0px',
              border: 'none',
              position: 'absolute',
              right: '15px',
              top: '15px',
            }}
            color="secondary"
          >
            <CloseIcon
              onClick={handleClose}
              sx={{ width: '30px', height: '30px' }}
            />
          </IconButton>
        </Box>

        <OutlinedInput
          multiline
          rows={8}
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          sx={{
            width: '100%',
            borderRadius: '15px',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {saving ? (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
              sx={{ fontColor: '#fff' }}
              color="secondary"
            >
              Saving
            </LoadingButton>
          ) : (
            <Button onClick={handleSave}> Save and close </Button>
          )}
        </Box>
      </Box>
    </Modal>
  )
}

export default NotesModal
