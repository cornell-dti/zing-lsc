import { Typography, OutlinedInput, Button } from '@mui/material'
import { AddAdminProp } from './types'
import { ZingModal } from '@core/index'
import { useState } from 'react'

const AddAdminModal = ({ open, handleClose, modalNotes }: AddAdminProp) => {
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  return (
    <ZingModal open={open} onClose={handleClose}>
      <ZingModal.Title onClose={handleClose}>
        <Typography variant="h4" sx={{ fontWeight: '500' }}>
          Add New Adminstrator
        </Typography>
      </ZingModal.Title>

      <ZingModal.Body>
        <Typography variant="h6" sx={{ fontWeight: '300', padding: 1 }}>
          Name:
        </Typography>
        <OutlinedInput
          multiline
          rows={1}
          onChange={(e) => setNewName(e.target.value)}
          sx={{
            width: '100%',
            borderRadius: '15px',
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: '300', padding: 1 }}>
          Email:
        </Typography>
        <OutlinedInput
          multiline
          rows={1}
          onChange={(e) => setNewEmail(e.target.value)}
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
        <Button
          variant="outlined"
          color="primary"
          onClick={() => modalNotes({ name: newName, email: newEmail })}
        >
          Confirm
        </Button>
      </ZingModal.Controls>
    </ZingModal>
  )
}

export default AddAdminModal
