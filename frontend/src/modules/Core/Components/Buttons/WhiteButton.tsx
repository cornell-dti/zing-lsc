import React from 'react'
import { Button } from '@core/Types'
import { ButtonProps } from '@core/Types/FormFieldProps'
import { colors } from '@core'

export const WhiteButton = ({
  containerStyle = {},
  labelStyle = {},
  label,
  onClick,
  disabled = false,
  ...buttonProps
}: ButtonProps) => {
  const whiteContainerStyle = {
    border: `1px solid ${colors.darkpurple}`,
    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)',
    alignSelf: 'flex-end',
    padding: '0 1.5rem',
    height: '60px',
    borderRadius: '30px',
    ...containerStyle, // Provide defaults for style but can be overridden
  }

  const whiteLabelStyle = {
    color: colors.darkpurple,
    fontWeight: '600',
    fontSize: '1.5rem',
    textTransform: 'none',
    ...labelStyle,
  }

  return (
    <Button
      containerStyle={whiteContainerStyle}
      labelStyle={whiteLabelStyle}
      label={label}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    />
  )
}
