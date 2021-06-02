import React from 'react'

import { colors } from '@core'
import { InputField } from '@core/Components/InputField'
import { InputProps } from '@core/Types/FormFieldProps'

export const PasswordField = ({
  fullWidth = true,
  endAdornment,
  key = 'default',
  MuiColor = colors.darkpurple,
  containerStyle,
  inputStyle,
  placeholder = 'Password',
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
      type="password"
      placeholder={placeholder}
      disabled={disabled}
      error={error}
    />
  )
}
