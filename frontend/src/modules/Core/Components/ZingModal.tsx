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

interface DialogTitleProps {
  children?: React.ReactNode
  titleFontSize?: string
  onClose: () => void
}

const TempDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose } = props

  return (
    <DialogTitle
      sx={{
        m: 0,
        pl: 3,
        pr: 2,
        pt: 2,
        pb: 1,
        textAlign: 'center',
        fontSize: props.titleFontSize,
      }}
    >
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

export const ZingModal = (props: ZingModalProps) => {
  const TempDialog = styled(Dialog)(({ theme }) => ({
    '&.MuiDialog-root *': {
      fontFamily: 'Montserrat',
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(1, 4),
      minWidth: props.containerWidth || 'fit-content',
      minHeight: props.containerHeight || '100px',
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(2, 3, 3),
    },
    '& .MuiDialog-container': {
      '& .MuiPaper-root': {
        width: '100%',
        minWidth: props.containerWidth || '500px',
      },
    },
  }))

  return (
    <TempDialog
      onClose={props.onClose}
      open={props.open}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          '-webkit-tap-highlight-color': 'transparent',
        },
      }}
      fullWidth
      // imo the sx should go to the actual content container rather than the outermost div
      // or we should just use a different, more descriptive prop name
      // sx={props.sx}
    >
      <TempDialogTitle
        onClose={props.onClose}
        titleFontSize={props.titleFontSize}
      >
        {props.title}
      </TempDialogTitle>
      <DialogContent sx={props.sx}>{props.children}</DialogContent>
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
