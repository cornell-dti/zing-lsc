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
import theme from '@core/Constants/Theme'
import { useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { AuthProvider } from './auth/AuthContext'
import { auth } from './firebase/firebase'
import { PrivateRoute } from './auth/PrivateRoute'

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider value={currentUser}>
            <Switch>
              <Route exact path={HOME_PATH} component={Home} />
              <Route exact path={LOGIN_PATH} component={Login} />
              <Route exact path={SIGNUP_PATH} component={Signup} />
              <Route exact path={SURVEY_PATH} component={Survey} />
              <Route exact path={CREATE_ZING_PATH} component={CreateZingForm} />
              <PrivateRoute exact path={DASHBOARD_PATH} component={Dashboard} />
              <Route
                exact
                path={`${EDIT_ZING_PATH}/:courseId`}
                component={EditZing}
              />
            </Switch>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
