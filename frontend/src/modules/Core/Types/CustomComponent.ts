import { ButtonProps, SelectChangeEvent } from '@mui/material'
import React, { ChangeEventHandler } from 'react'

// for the modal (dialog box)
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

// for general input components
export interface InputSubsetProps {
  disabled?: boolean
  fullWidth?: boolean
  size?: 'medium' | 'small'
  id?: string
  margin?: 'dense' | 'none' | 'normal'
  value?: any
  defaultValue?: any
}

// for the search bar
export interface SearchBarProps extends InputSubsetProps {
  helperText?: React.ReactNode
  autoFocus?: boolean
  autoComplete?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  minWidth?: number
}

// for the dropdown select (meant for forms)
export interface DropdownSelectProps extends InputSubsetProps {
  minWidth?: number
  children?: React.ReactNode
  helperText?: string
  onChange?: (event: SelectChangeEvent, child: React.ReactNode) => void
}

// for the pagination (no support for making this controlled)
export interface PageNumberProps {
  count?: number
  defaultPage?: number
  page?: number
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<unknown>, page: number) => void
  siblingCount?: number
  boundaryCount?: number
  useRouter?: boolean
}

// for the progress bar
export interface ProgressBarProps {
  value?: number
  step?: number
  total?: number
}
