import React, { useState } from 'react'
import {
  TextField,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  createTheme,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { colors, montserratFont } from '@core'
import { InputProps } from '@core/Types/FormFieldProps'
import {
  defaultContainerStyle,
  defaultInputStyle,
} from '@core/Styles/InputField.style'
import ErrorIconOutline from '@mui/icons-material/ErrorOutline'
import styled from '@mui/styled-engine'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// converted these with styled components from the styled API in MUI

/** customized TextInput with themed underlines */
const StyledTextField = styled(TextField)`
  &&.MuiInput-underline:hover::before {
    border-color: ${(props) => (props.color ? props.color : colors.darkpurple)};
  }

  &&.MuiInput-underline:before {
    border-color: ${(props) => (props.color ? props.color : colors.darkpurple)};
  }

  &&.MuiInput-underline:after {
    border-color: ${(props) => (props.color ? props.color : colors.darkpurple)};
  }
`

/** customized TextInput for form validation errors with red underlines */
const StyledErrorTextField = styled(TextField)`
  && .MuiInput-underline:hover::before {
    border-color: ${colors.red};
  }

  && .MuiInput-underline:before {
    border-color: ${colors.red};
  }

  && .MuiInput-underline:after {
    border-color: ${colors.red};
  }
`

// using new input theme
const inputFieldTheme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: ${montserratFont.fontFamily};
        font-style: ${montserratFont.fontStyle};
        font-display: ${montserratFont.fontDisplay};
        font-weight: ${montserratFont.fontWeight};
        src: ${montserratFont.src};
      }
    `,
    },
  },
})

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
  const [localValue, setLocalValue] = useState(value)
  /** Error icon that is attached as a endAndornment to the textfield when error
   * occurs */
  const icon = <ErrorIconOutline style={{ fill: colors.red }} />

  return (
    <StyledEngineProvider injectFirst>
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
            sx={Object.assign({}, defaultContainerStyle, containerStyle)}
            inputProps={{
              sx: Object.assign({}, defaultInputStyle, inputStyle),
            }}
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
            sx={Object.assign({}, defaultContainerStyle, containerStyle)}
            inputProps={{
              sx: Object.assign({}, defaultInputStyle, inputStyle),
            }}
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
    </StyledEngineProvider>
  )
}
