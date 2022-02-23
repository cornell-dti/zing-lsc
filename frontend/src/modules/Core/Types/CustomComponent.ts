import { ButtonProps, SelectChangeEvent } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import React, { ChangeEventHandler } from 'react'

// for the modal (dialog box)
export interface ZingModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  primaryButtonProps?: ButtonProps // can take sx
  secondaryButtonProps?: ButtonProps // can take sx
  sx?: SxProps<Theme>
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
  inputSx?: SxProps<Theme>
}

// for the search bar
export interface SearchBarProps extends InputSubsetProps {
  helperText?: React.ReactNode
  autoFocus?: boolean
  autoComplete?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  minWidth?: number
  sx?: SxProps<Theme>
}

// for the dropdown select (meant for forms)
export interface DropdownSelectProps extends InputSubsetProps {
  minWidth?: number
  children?: React.ReactNode
  helperText?: string
  onChange?: (event: SelectChangeEvent, child: React.ReactNode) => void
  sx?: SxProps<Theme>
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
  sx?: SxProps<Theme>
  itemSx?: SxProps<Theme>
}

// for the progress bar
export interface ProgressBarProps {
  value?: number
  step?: number
  total?: number
  sx?: SxProps<Theme>
}
