import React from 'react'
import { Button as MaterialUIButton } from '@mui/material'
import { ButtonProps } from '@core/Types/FormFieldProps'
import {
  defaultContainerStyle,
  defaultLabelStyle,
} from '@core/Styles/Button.style'

export const Button = ({
  containerStyle = {},
  labelStyle = {},
  label,
  onClick,
  disabled = false,
  ...buttonProps
}: ButtonProps) => {
  const newContainerStyles = Object.assign(
    {},
    defaultContainerStyle,
    containerStyle
  )
  const newLabelStyles = Object.assign({}, defaultLabelStyle, labelStyle)

  return (
    <MaterialUIButton
      sx={{
        '&.MuiButton-root': newContainerStyles,
        '&.MuiButton-text': newLabelStyles,
      }}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {label}
    </MaterialUIButton>
  )
}
