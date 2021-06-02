import React from 'react'

import { InputField } from '@core/Components/InputField'
import { InputProps } from '@core/Types/FormFieldProps'

export const NumberField = ({
  fullWidth = true,
  containerStyle,
  inputStyle,
  placeholder = '0',
  value,
  onChange,
  disabled,
  error = '',
}: InputProps) => {
  return (
    <InputField
      isNumber={true}
      error={error}
      fullWidth={fullWidth}
      containerStyle={containerStyle}
      inputStyle={inputStyle}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onKeyPress={(event: any) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault()
        }
      }}
      type="number"
    />
  )
}
