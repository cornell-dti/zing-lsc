import React from 'react'
import { Button as MaterialUIButton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

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
        // changed this text upgrading from v4 to v5, label does not exist anymore
        text: classes.input,
      }}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {label}
    </MaterialUIButton>
  )
}
