import React, { useState } from 'react'
import { TextField, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import { colors, montserratFont } from '@core'
import { InputProps } from '@core/Types/FormFieldProps'
import {
  defaultContainerStyle,
  defaultInputStyle,
} from '@core/Styles/InputField.style'
import ErrorIconOutline from '@material-ui/icons/ErrorOutline'

/** customized TextInput with themed underlines */
const StyledTextField = styled(TextField)`
&& .MuiInput-underline:hover::before {
  border-color: ${(props) => (props.color ? props.color : colors.darkpurple)};
},
&& .MuiInput-underline:before {
  border-color: ${(props) => (props.color ? props.color : colors.darkpurple)};
},
&& .MuiInput-underline:after {
  border-color: ${(props) => (props.color ? props.color : colors.darkpurple)};
},
`
/** customized TextInput for form validation errors with red underlines */
const StyledErrorTextField = styled(TextField)`
&& .MuiInput-underline:hover::before {
  border-color: ${colors.red};
},
&& .MuiInput-underline:before {
  border-color: ${colors.red};
},
&& .MuiInput-underline:after {
  border-color: ${colors.red};
},
`

/** Generic InputField component for more specific fields to customize */
export const InputField = ({
  fullWidth,
  endAdornment,
  key,
  MuiColor = colors.darkpurple,
  containerStyle = {},
  inputStyle = {},
  type = 'input',
  error = '',
  placeholder,
  disabled = false,
  value,
  onChange,
  isNumber = false,
  ...inputProps
}: InputProps) => {
  const classes = makeStyles({
    container: Object.assign({}, defaultContainerStyle, containerStyle),
    input: Object.assign({}, defaultInputStyle, inputStyle),
  })()

  const [localValue, setLocalValue] = useState(value)
  /** Error icon that is attached as a endAndornment to the textfield when error
   * occurs */
  const icon = <ErrorIconOutline style={{ fill: colors.red }} />

  const inputFieldTheme = createMuiTheme({
    typography: {
      fontFamily: 'Montserrat',
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [montserratFont],
        },
      },
    },
  })

  return (
    <ThemeProvider theme={inputFieldTheme}>
      {error === '' ? (
        <StyledTextField
          onClick={() =>
            // if number input, make sure its > 0
            isNumber && Number(localValue) < 0
              ? setLocalValue('0')
              : setLocalValue(localValue)
          }
          fullWidth={fullWidth}
          key={key}
          className={classes.container}
          inputProps={{ className: classes.input }}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          value={localValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocalValue(e.target.value)
          }
          onBlur={onChange}
          {...inputProps}
        />
      ) : (
        <StyledErrorTextField
          error
          onClick={() =>
            // if number input, make sure its > 0
            isNumber && Number(localValue) < 0
              ? setLocalValue('0')
              : setLocalValue(localValue)
          }
          fullWidth={fullWidth}
          key={key}
          helperText={error}
          className={classes.container}
          inputProps={{ className: classes.input }}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          value={localValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocalValue(e.target.value)
          }
          // onChange is really actually an onBlur for optimization
          onBlur={onChange}
          InputProps={{
            endAdornment: icon,
          }}
          {...inputProps}
        />
      )}
    </ThemeProvider>
  )
}
