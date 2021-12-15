import React from 'react'
import { Slider as MaterialUISlider } from '@mui/material'
import { SliderProps } from '@core/Types/FormFieldProps'

// migrating using sx because this makes things slightly easier
// https://mui.com/customization/how-to-customize/#1-one-off-customization

export const Slider = ({
  containerStyle = {},
  railStyle = {},
  trackStyle = {},
  thumbStyle = {},
  thumbLabelStyle = {},
  markStyle = {},
  markLabelStyle = {},
  disabled = false,
  step = 1,
  min,
  max,
  value,
  onChange,
  ...sliderProps
}: SliderProps) => {
  return (
    <MaterialUISlider
      sx={{
        '& .MuiSlider-root': containerStyle,
        '& .MuiSlider-rail': railStyle,
        '& .MuiSlider-track': trackStyle,
        '& .MuiSlider-thumb': thumbStyle,
        '& .MuiSlider-valueLabel': thumbLabelStyle,
        '& .MuiSlider-mark': markStyle,
        '& .MuiSlider-markLabel': markLabelStyle,
      }}
      disabled={disabled}
      step={step}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      {...sliderProps}
    />
  )
}
