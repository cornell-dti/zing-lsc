import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Typography, OutlinedInput } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'

import { API_ROOT } from '@core/Constants'
import axios from 'axios'
import { NotesModalProps } from 'EditZing/Types/ComponentProps'
import { ZingModal } from '@core/Components'

const NotesModal = ({
  open,
  student,
  studentNotes,
  setStudentNotes,
  handleClose,
  setSaved,
  setNotSaved,
}: NotesModalProps) => {
  const { courseId } = useParams<{ courseId: string }>()
  const [saving, setSaving] = useState(false)
  const email = student.email

  // saving notes to db
  const handleSave = async () => {
    setSaving(true)
    await axios
      .post(`${API_ROOT}/student/notes`, {
        email: email,
        courseId: courseId,
        notes: studentNotes,
      })
      .then(() => {
        setSaved(true)
      })
      .catch(() => setNotSaved(true))
    setSaving(false)
    handleClose()
  }

  return (
    <ZingModal open={open} onClose={handleClose}>
      <ZingModal.Title onClose={handleClose}>
        <Typography variant="h4" sx={{ fontWeight: '500' }}>
          Notes for {student.name}
        </Typography>
      </ZingModal.Title>
      <ZingModal.Body>
        <OutlinedInput
          multiline
          rows={8}
          value={studentNotes}
          onChange={(e) => setStudentNotes(e.target.value)}
          sx={{
            width: '100%',
            borderRadius: '15px',
          }}
        />
      </ZingModal.Body>
      <ZingModal.Controls>
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
      </ZingModal.Controls>
    </ZingModal>
  )
}

export default NotesModal
