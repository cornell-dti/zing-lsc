import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  DialogTitleProps as MuiDialogTitleProps,
  DialogContentProps,
  DialogActionsProps,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import React from 'react'
import { ZingModalProps } from '@core'

// SUB COMPONENTS OF THE MODAL DEFINED HERE, MEANT TO BE USED iN MODAL

interface DialogTitleProps extends MuiDialogTitleProps {
  children?: React.ReactNode
  onClose: () => void
}

const Title = (props: DialogTitleProps) => {
  const { children, onClose, sx } = props

  return (
    <DialogTitle
      sx={{
        m: 0,
        pl: 3,
        pr: 2,
        pt: 2,
        pb: 1,
        textAlign: 'center',
        ...sx,
      }}
      {...props}
    >
      {children}
      {onClose && (
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
      )}
    </DialogTitle>
  )
}

const Body = (props: DialogContentProps) => {
  const { sx, children } = props

  return (
    <DialogContent
      sx={{
        '& .MuiDialogContent-root': {
          padding: (theme) => theme.spacing(1, 4),
          minWidth: 'fit-content',
          minHeight: '100px',
        },
        ...sx,
      }}
    >
      {children}
    </DialogContent>
  )
}

const Controls = (props: DialogActionsProps) => {
  const { sx, children } = props

  return (
    <DialogActions
      sx={{
        display: { md: 'flex' },
        justifyContent: 'space-between',
        padding: (theme) => theme.spacing(2, 3, 3),
        ...sx,
      }}
    >
      {children}
    </DialogActions>
  )
}

const TempDialog = styled(Dialog, {
  shouldForwardProp: (prop) =>
    prop !== 'containerWidth' && prop !== 'containerHeight',
})<ZingModalProps>(({ containerHeight, containerWidth }) => ({
  '&.MuiDialog-root *': {
    fontFamily: 'Montserrat',
  },
  '& .MuiDialog-container': {
    '& .MuiPaper-root': {
      width: '100%',
      minWidth: containerWidth || '200px',
      minHeight: containerHeight || 'initial',
    },
  },
}))

// possible components to keep track of for styling: MuiPaper root

const ZingModal = (props: ZingModalProps) => {
  const { children } = props
  return <TempDialog {...props}>{children}</TempDialog>
}

// define dot notation: https://stackoverflow.com/questions/60882627/using-dot-notation-with-functional-component
ZingModal.Title = Title
ZingModal.Body = Body
ZingModal.Controls = Controls

export default ZingModal
