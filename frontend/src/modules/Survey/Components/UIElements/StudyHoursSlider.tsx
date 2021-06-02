import React from 'react'

import { Slider } from '@core/Components/Slider'
import { SliderProps } from '@core/Types/FormFieldProps'

export const StudyHoursSlider = ({ value, onChange }: SliderProps) => {
  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 12,
      label: '12+',
    },
  ]

  const trackStyle = {
    color: '#CD9CF2',
    height: 10,
  }

  const railStyle = {
    color: '#E8D6FB',
    opacity: 1,
    height: 10,
  }

  const markLabelStyle = {
    color: '#E8D6FB',
  }

  const thumbStyle = {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  }

  return (
    <Slider
      thumbStyle={thumbStyle}
      trackStyle={trackStyle}
      railStyle={railStyle}
      markLabelStyle={markLabelStyle}
      value={value}
      defaultValue={0}
      onChange={onChange}
      min={0}
      max={12}
      step={1}
      marks={marks}
      valueLabelDisplay="on"
    />
  )
}
