import { colors } from '@core'
import { CheckboxProps } from '@core/Types'
import {
  Checkbox as MaterialUICheckbox,
  FormControlLabel,
  styled,
} from '@mui/material'
import {
  defaultContainerStyle,
  defaultLabelStyle,
} from '@core/Styles/Checkbox.style'

const PurpleCheckbox = styled((props: CheckboxProps) => (
  <MaterialUICheckbox color="default" {...props} />
))`
  &.MuiCheckbox-root {
    color: ${colors.darkpurple};
  }

  .Mui-checked {
    color: ${colors.darkpurple};
  }
`

export const Checkbox = ({
  containerStyle = {},
  labelStyle = {},
  checked,
  onChange,
  key,
  label,
  labelPlacement = 'end',
}: CheckboxProps) => {
  const newContainerStyles = Object.assign(
    {},
    defaultContainerStyle,
    containerStyle
  )
  const newLabelStyles = Object.assign({}, defaultLabelStyle, labelStyle)

  // Whoa it's got a form control label attached to it!!!!1!
  return (
    <FormControlLabel
      sx={{
        '& .MuiFormControlLabel-root': newContainerStyles,
        '& .MuiFormControlLabel-label': newLabelStyles,
      }}
      control={
        <PurpleCheckbox checked={checked} onChange={onChange} label={label} />
      }
      key={key}
      label={label}
      labelPlacement={labelPlacement}
    />
  )
}
