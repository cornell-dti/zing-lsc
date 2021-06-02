import React from 'react'
import { Slider as MaterialUISlider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { SliderProps } from '@core/Types/FormFieldProps'
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
  const classes = makeStyles({
    container: containerStyle,
    rail: railStyle,
    track: trackStyle,
    thumb: thumbStyle,
    thumbLabel: thumbLabelStyle,
    mark: markStyle,
    markLabel: markLabelStyle,
  })()

  return (
    <MaterialUISlider
      classes={{
        root: classes.container,
        rail: classes.rail,
        track: classes.track,
        thumb: classes.thumb,
        valueLabel: classes.thumbLabel,
        mark: classes.mark,
        markLabel: classes.markLabel,
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
