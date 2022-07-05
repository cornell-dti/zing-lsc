import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Modal, Box, TextField, Button, Typography } from '@mui/material'
import { API_ROOT } from '@core/Constants'
import axios from 'axios'

const NotesModal = (props: any) => {
  const { courseId } = useParams<{ courseId: string }>()

  const { open, student, handleClose } = props
  const [note, setNote] = useState(student.notes)
  const email = student.email

  useEffect(() => {
    axios
      .get(`${API_ROOT}/student/notes/${courseId}/${email}`)
      .then((res) => {
        setNote(res.data)
        console.log('Response is', res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleSave = async () => {
    const save = await axios.post(`${API_ROOT}/student/notes`, {
      email: student.email,
      courseId: courseId,
      notes: note,
    })
    console.log(save)
    console.log(student)
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
          borderRadius: '10px',
          margin: '25px',
        }}
      >
        <Typography variant="h4" sx={{ width: '100%' }}>
          {' '}
          Notes for {student.name}{' '}
        </Typography>
        <TextField
          variant="outlined"
          multiline
          rows={8}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{
            width: '100%',
            borderRadius: '8px',
            margin: '0',
            padding: '0',
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
          <Button onClick={handleSave}> Save and close </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default NotesModal
