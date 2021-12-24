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
import Components from './modules/Components'

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
// can pick the different colors with sx (e.g. color: 'purple.120')
// essentials is all the blacks (white is located within "common")
// this theme statement defines all of the colors
let theme = createTheme({
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
      main: '#815ED4',
      120: '#6D52AF',
      100: '#815ED4',
      75: '#A186DF',
      50: '#C0AEEA',
      30: '#D9CFF2',
      25: '#DFD7F4',
      12: '#F0ECFA',
    },
    primary: {
      main: '#815ED4',
      light: '#A186DF',
      dark: '#6D52AF',
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
  breakpoints: {},
})

// this defines everything else
theme = createTheme(theme, {
  typography: {
    fontFamily: 'Montserrat, Arial',
  },
  components: {
    MuiCssBaseline: {
      // inject font face in to CSS
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
    MuiButton: {
      defaultProps: {
        // make the default contained
        variant: 'contained',
      },
      styleOverrides: {
        // for all buttons
        root: {
          fontFamily: 'Montserrat',
          fontWeight: 600,
          borderRadius: 40,
          paddingLeft: 15,
          paddingRight: 15,
          textTransform: 'initial',
          fontSize: 18,
        },
        sizeSmall: {
          fontSize: 14,
        },
        containedPrimary: {
          backgroundColor: theme.palette.purple.main,
          color: theme.palette.common.white,
          '&.Mui-disabled': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.essentials[25],
          },
        },
        outlinedSecondary: {
          borderColor: theme.palette.purple[100],
          backgroundColor: theme.palette.common.white,
          color: theme.palette.purple[100],
          '&:hover': {
            backgroundColor: theme.palette.essentials[6],
            borderColor: theme.palette.purple[100],
          },
          '&.Mui-disabled': {
            color: theme.palette.essentials[50],
            backgroundColor: theme.palette.essentials[25],
            borderColor: theme.palette.essentials[25],
          },
        },
      },
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
            <Route exact path="/components" component={Components} />
          </Switch>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
