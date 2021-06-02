import React from 'react'
import { Button } from '@core/Types'
import { ButtonProps } from '@core/Types/FormFieldProps'

export const PrimaryGradientButton = ({
  containerStyle = {},
  labelStyle = {},
  label,
  onClick,
  disabled = false,
  ...buttonProps
}: ButtonProps) => {
  const primaryGradientContainerStyle = {
    background: 'linear-gradient(296.38deg, #CD9CF2 5.53%, #E8D6FB 96.38%)',
    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)',
    alignSelf: 'flex-end',
    padding: '0 1.5rem',
    height: '60px',
    borderRadius: '30px',
    ...containerStyle, // Provide defaults for style but can be overridden
  }

  const primaryGradientLabelStyle = {
    fontWeight: '600',
    fontSize: '1.5rem',
    textTransform: 'none',
    ...labelStyle,
  }

  return (
    <Button
      containerStyle={primaryGradientContainerStyle}
      labelStyle={primaryGradientLabelStyle}
      label={label}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    />
  )
}
