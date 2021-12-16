import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import {
  HOME_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
  SURVEY_PATH,
  CREATE_ZING_PATH,
  EDIT_ZING_PATH,
  DASHBOARD_PATH,
  montserratFont,
} from '@core'
import { Home } from 'Home'
import { Login } from 'Login'
import { Signup } from 'Signup'
import { Survey } from 'Survey'
import { CreateZingForm } from 'CreateZing'
import { EditZing } from 'EditZing'
import { Dashboard } from 'Dashboard'
import './App.css'

// module augmentation, needed for TypeScript

declare module '@mui/material/styles' {
  interface Palette {
    purple: Palette['primary']
  }
  interface PaletteOptions {
    purple: PaletteOptions['primary']
  }
  interface Palette {
    essentials: Palette['primary']
  }
  interface PaletteOptions {
    essentials: PaletteOptions['primary']
  }

  interface PaletteColor {
    120?: string
    100?: string
    75?: string
    50?: string
    30?: string
    25?: string
    12?: string
    6?: string
  }
  interface SimplePaletteColorOptions {
    120?: string
    100?: string
    75?: string
    50?: string
    30?: string
    25?: string
    12?: string
    6?: string
  }
}

// https://www.figma.com/file/5sae0s8rk6r9iVwpn74RY4/Zing-Components?node-id=804%3A10807
// can pick the different colors with sx
// essentials is all the blacks (white is located within "common")
const theme = createTheme({
  palette: {
    essentials: {
      main: '#2F2E41',
      100: '#2F2E41',
      75: '#5C5B6A',
      50: '#898992',
      25: '#B8B7BC',
      12: '#DBDBDD',
      6: '#EDEDEE',
    },
    purple: {
      main: '#CE9EF2',
      120: '#AE88CF',
      100: '#CE9EF2',
      75: '#D9B6F6',
      50: '#E8D6FB',
      30: '#F7EDFF',
      25: '#F6F3FF',
      12: '#FBF9FF',
    },
    primary: {
      main: '#CE9EF2',
      light: '#D9B6F6',
      dark: '#AE88CF',
    },
    error: {
      main: '#FF6584',
      light: '#FFE2E8',
      dark: '#EE7F7F',
    },
    info: {
      main: '#F9E21B',
      light: '#F6F9DA',
    },
    success: {
      main: '#157E2C',
      light: '#F0F9F4',
      dark: '#CEF5D6',
    },
  },
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

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path={HOME_PATH} component={Home} />
            <Route exact path={LOGIN_PATH} component={Login} />
            <Route exact path={SIGNUP_PATH} component={Signup} />
            <Route exact path={SURVEY_PATH} component={Survey} />
            <Route exact path={CREATE_ZING_PATH} component={CreateZingForm} />
            <Route exact path={DASHBOARD_PATH} component={Dashboard} />
            <Route
              exact
              path={`${EDIT_ZING_PATH}/:courseId`}
              component={EditZing}
            />
          </Switch>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
