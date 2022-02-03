import { ButtonProps, SelectChangeEvent } from '@mui/material'
import React, { ChangeEventHandler } from 'react'

export interface ZingModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  primaryButtonProps?: ButtonProps
  secondaryButtonProps?: ButtonProps
}

export interface InputSubsetProps {
  disabled?: boolean
  fullWidth?: boolean
  size?: 'medium' | 'small'
  id?: string
  margin?: 'dense' | 'none' | 'normal'
  value?: any
  defaultValue?: any
}

export interface SearchBarProps extends InputSubsetProps {
  helperText?: React.ReactNode
  autoFocus?: boolean
  autoComplete?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
}

export interface DropdownSelectProps extends InputSubsetProps {
  minWidth?: number
  children?: React.ReactNode
  helperText?: string
  onChange?: (event: SelectChangeEvent, child: React.ReactNode) => void
}
