import React from 'react'

interface Common {
  containerStyle?: { [key in string]: any }
  disabled?: boolean
  [x: string]: any
}

export interface InputProps extends Common {
  fullWidth?: boolean // should the inputfield take up the full container?
  endAdornment?: JSX.Element // icon that may appears at the end of the field
  key?: string // for id of component
  MuiColor?: string // for editing underline and stuff for MUI component
  inputStyle?: { [key in string]: any }
  type?: string
  placeholder?: string
  error: string
  value: string
  onChange: (e: React.ChangeEvent<any>) => void
  isNumber?: boolean // is this textinput type taking in only numbers?
}

export interface ButtonProps extends Common {
  label?: string | React.Component
  labelStyle?: { [key in string]: any }
  onClick: () => void
}

interface MarkProps {
  value: number
  label?: string
}

export interface SliderProps extends Common {
  railStyle?: { [key in string]: any }
  trackStyle?: { [key in string]: any }
  thumbStyle?: { [key in string]: any }
  thumbLabelStyle?: { [key in string]: any }
  markStyle?: { [key in string]: any }
  markLabelStyle?: { [key in string]: any }
  defaultValue?: number | Array<number>
  min?: number
  max?: number
  step?: number
  marks?: boolean | Array<MarkProps>
  value: number | Array<number>
  onChange: (e: React.ChangeEvent<any>, value: number | number[]) => void
}

export interface GoToButtonProps extends Common {
  className?: string | undefined
  label?: string | React.Component
  labelStyle?: { [key in string]: string }
  src: string
  onClick: () => void
}

export interface RadioButtonProps extends Common {
  currentAnswer: string
  onClick: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClickLabel?: (s: string) => void
  value: string
  label: string
  key: string
}

export interface RadioButtonsProps extends Common {
  currentAnswer: string
  values: string[]
  onClick: (e: React.ChangeEvent<HTMLInputElement>) => void // to set state of user information in index.tsx
  onClickLabel?: (s: string) => void // to set state when label is clicked
  key: string
}

export interface CheckboxProps extends Common {
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  key?: string
  label: string
  labelPlacement?: 'bottom' | 'end' | 'start' | 'top'
  labelStyle?: { [key in string]: any }
}
