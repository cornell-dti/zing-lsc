import React from 'react'

import { colors } from '@core'
import { InputField } from '@core/Components/InputField'
import { InputProps } from '@core/Types/FormFieldProps'

export const EmailField = ({
  fullWidth = true,
  endAdornment,
  key = 'default',
  MuiColor = colors.darkpurple,
  containerStyle,
  inputStyle,
  placeholder = 'Email',
  value,
  onChange,
  disabled,
  error,
}: InputProps) => {
  return (
    <InputField
      fullWidth={fullWidth}
      endAdornment={endAdornment}
      key={key}
      MuiColor={MuiColor}
      containerStyle={containerStyle}
      inputStyle={inputStyle}
      value={value}
      onChange={onChange}
      type="email"
      placeholder={placeholder}
      disabled={disabled}
      error={error}
    />
  )
}
