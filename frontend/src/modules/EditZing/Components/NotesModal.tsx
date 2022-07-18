import { Button, Typography, OutlinedInput } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'

import { NotesModalProps } from 'EditZing/Types/ComponentProps'
import { ZingModal } from '@core/Components'

const NotesModal = ({
  open,
  isSaving,
  name,
  modalNotes,
  setModalNotes,
  saveModalNotes,
  handleClose,
}: NotesModalProps) => {
  return (
    <ZingModal open={open} onClose={handleClose}>
      <ZingModal.Title onClose={handleClose}>
        <Typography variant="h4" sx={{ fontWeight: '500' }}>
          Notes for {name}
        </Typography>
      </ZingModal.Title>
      <ZingModal.Body>
        <OutlinedInput
          multiline
          rows={8}
          value={modalNotes}
          onChange={(e) => setModalNotes(e.target.value)}
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
        {isSaving ? (
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
          <Button onClick={saveModalNotes}>Save and close</Button>
        )}
      </ZingModal.Controls>
    </ZingModal>
  )
}

export default NotesModal
