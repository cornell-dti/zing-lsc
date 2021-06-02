import React from 'react'

import { Button } from '@core/Components/Button'
import { ButtonProps } from '@core/Types/FormFieldProps'

export const GetConnectedButton = ({ onClick }: ButtonProps) => {
  const containerStyle = {
    background: 'linear-gradient(296.38deg, #CD9CF2 5.53%, #E8D6FB 96.38%)',
    borderRadius: '40px',
    width: '50%',
    minWidth: 'fit-content',
    alignSelf: 'flex-end',
  }

  const labelStyle = {
    fontSize: '1.5rem',
    lineHeight: '3.75rem',
    textTransform: 'capitalize',
  }

  return (
    <Button
      containerStyle={containerStyle}
      labelStyle={labelStyle}
      label="Get Connected"
      onClick={onClick}
    />
  )
}
