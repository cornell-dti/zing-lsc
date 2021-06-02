import React from 'react'

import { colors } from '@core'
import { InputField } from '@core/Components/InputField'
import { InputProps } from '@core/Types/FormFieldProps'

export const YearField = ({
  error = '',
  MuiColor = colors.darkpurple,
  fullWidth = true,
  containerStyle,
  inputStyle,
  placeholder = 'Graduation Year',
  value,
  onChange,
  disabled,
}: InputProps) => {
  return (
    <InputField
      isNumber={true}
      error={error}
      MuiColor={MuiColor}
      fullWidth={fullWidth}
      containerStyle={containerStyle}
      inputStyle={inputStyle}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type="text"
      onKeyPress={(event: any) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault()
        }
      }}
    />
  )
}
