import React, { useState } from 'react'
import { useHistory } from 'react-router'

import {
  StyledBackground,
  StyledContainer,
  StyledCenter,
  StyledHeader,
  StyledHeaderText,
  StyledWelcomeText,
  StyledFields,
} from 'Login/Styles/Login.style'
import {
  EmailField,
  PasswordField,
  PrimaryGradientButton,
} from '@core/Components'
import { colors } from '@core/Constants'

export const Login = () => {
  const history = useHistory()

  // Email and password props
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  /** Error messages */
  enum LoginError {
    NONE = '',
    INCORRECT = 'Email or password is incorrect',
  }
  const [emailError, setEmailError] = useState(LoginError.NONE)
  const [passwordError, setPasswordError] = useState(LoginError.NONE)

  const handleLogin = () => {
    // Fake login
    if (email === 'hello@cornelldti.org' && password === 'zing') {
      history.push('/dashboard')
    } else {
      setEmailError(LoginError.INCORRECT)
      setPasswordError(LoginError.INCORRECT)
    }
  }

  const textContainerStyle = {
    width: '388px',
  }

  const textInputStyle = {
    fontWeight: '600',
    color: colors.darkpurple,
  }

  const textInputErrorStyle = {
    fontWeight: '600',
    color: colors.red,
  }

  return (
    <StyledBackground>
      <StyledContainer>
        <StyledCenter>
          <StyledHeader>
            <StyledHeaderText>Log in</StyledHeaderText>
            <StyledWelcomeText>Welcome back!</StyledWelcomeText>
          </StyledHeader>
          <StyledFields>
            <EmailField
              containerStyle={textContainerStyle}
              inputStyle={emailError ? textInputErrorStyle : textInputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
            <PasswordField
              containerStyle={textContainerStyle}
              inputStyle={passwordError ? textInputErrorStyle : textInputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
            />
          </StyledFields>
          <PrimaryGradientButton label="Log In" onClick={handleLogin} />
        </StyledCenter>
      </StyledContainer>
    </StyledBackground>
  )
}
