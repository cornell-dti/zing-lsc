import { Typography, TextField, Button, Box } from '@mui/material'
import { AddAdminProp } from './types'
import { ZingModal } from '@core/index'
import { FormEvent, useState } from 'react'

const AddAdminModal = ({ open, handleClose, addAdmin }: AddAdminProp) => {
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [requiredField, setRequiredField] = useState(false)

  return (
    <ZingModal open={open} onClose={handleClose}>
      <Box
        component={'form'}
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          if (newEmail.includes('@') && newEmail.includes('.')) {
            addAdmin({ name: newName, email: newEmail })
            handleClose()
          } else {
            setRequiredField(true)
          }
        }}
      >
        <ZingModal.Title onClose={handleClose}>
          <Typography variant="h4" sx={{ fontWeight: '500' }}>
            Add New Adminstrator
          </Typography>
        </ZingModal.Title>
        <ZingModal.Body>
          <Typography variant="h6" sx={{ fontWeight: '300', padding: 1 }}>
            Name:
          </Typography>
          <TextField
            required
            onChange={(e) => setNewName(e.target.value)}
            sx={{
              width: '100%',
              borderRadius: '15px',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: '300', padding: 1 }}>
            Email:
          </Typography>
          <TextField
            required
            onChange={(e) => {
              setNewEmail(e.target.value)
              setRequiredField(false)
            }}
            error={requiredField}
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
          <Button type="submit" variant="outlined" color="primary">
            Confirm
          </Button>
        </ZingModal.Controls>
      </Box>
    </ZingModal>
  )
}

export default AddAdminModal
