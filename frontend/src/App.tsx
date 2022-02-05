import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { StyledEngineProvider, ThemeProvider } from '@mui/material'
import { CssBaseline } from '@mui/material'
import {
  HOME_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
  SURVEY_PATH,
  CREATE_ZING_PATH,
  EDIT_ZING_PATH,
  DASHBOARD_PATH,
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
import theme from '@core/Constants/Theme'

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
