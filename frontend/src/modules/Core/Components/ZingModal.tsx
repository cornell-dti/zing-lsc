import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import React from 'react'
import { ZingModalProps } from '@core'

const TempDialog = styled(Dialog)(({ theme }) => ({
  '&.MuiDialog-root *': {
    fontFamily: 'Montserrat',
  },
  '& .MuiDialogContent-root': {
    minWidth: 500,
    minHeight: 100,
    padding: theme.spacing(1, 4),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2, 3, 3),
  },
}))

interface DialogTitleProps {
  children?: React.ReactNode
  onClose: () => void
}

const TempDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose } = props

  return (
    <DialogTitle sx={{ m: 0, pl: 3, pr: 2, pt: 2, pb: 1 }}>
      {children}
      {onClose ? (
        <IconButton
          color="default"
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

const ZingModal = (props: ZingModalProps) => {
  return (
    <TempDialog
      onClose={props.onClose}
      open={props.open}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          '-webkit-tap-highlight-color': 'transparent',
        },
      }}
    >
      <TempDialogTitle onClose={props.onClose}>{props.title}</TempDialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions sx={{ display: { md: 'flex' } }}>
        {props.secondaryButtonText && (
          <Button
            color="secondary"
            variant="outlined"
            {...props.secondaryButtonProps}
          >
            {props.secondaryButtonText}
          </Button>
        )}
        <Box flexGrow={1} />
        {props.primaryButtonText && (
          <Button {...props.primaryButtonProps}>
            {props.primaryButtonText}
          </Button>
        )}
      </DialogActions>
    </TempDialog>
  )
}

export default ZingModal
