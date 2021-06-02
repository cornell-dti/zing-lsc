import React from 'react'

import { colors } from '@core'
import { CheckboxProps } from '@core/Types'
import {
  Checkbox as MaterialUICheckbox,
  FormControlLabel,
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
  defaultContainerStyle,
  defaultLabelStyle,
} from '@core/Styles/Checkbox.style'

const PurpleCheckbox = withStyles({
  root: {
    color: colors.darkpurple,
    '&$checked': {
      color: colors.darkpurple,
    },
  },
  checked: {},
})((props: CheckboxProps) => <MaterialUICheckbox color="default" {...props} />)

export const Checkbox = ({
  containerStyle = {},
  labelStyle = {},
  checked,
  onChange,
  key,
  label,
  labelPlacement = 'end',
}: CheckboxProps) => {
  const classes = makeStyles({
    container: Object.assign({}, defaultContainerStyle, containerStyle),
    input: Object.assign({}, defaultLabelStyle, labelStyle),
  })()

  // Whoa it's got a form control label attached to it!!!!1!
  return (
    <FormControlLabel
      classes={{
        root: classes.container,
        label: classes.input,
      }}
      control={<PurpleCheckbox checked={checked} onChange={onChange} />}
      key={key}
      label={label}
      labelPlacement={labelPlacement}
    />
  )
}
