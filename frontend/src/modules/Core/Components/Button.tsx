import React from 'react'
import { Button as MaterialUIButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
  const classes = makeStyles({
    container: Object.assign({}, defaultContainerStyle, containerStyle),
    input: Object.assign({}, defaultLabelStyle, labelStyle),
  })()

  return (
    <MaterialUIButton
      classes={{
        root: classes.container,
        label: classes.input,
      }}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {label}
    </MaterialUIButton>
  )
}
