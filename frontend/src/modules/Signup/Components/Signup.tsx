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
} from 'Signup/Styles/Signup.style'
import {
  EmailField,
  Checkbox,
  NameField,
  PasswordField,
  PrimaryGradientButton,
} from '@core/Components'
import { colors } from '@core/Constants'

export const Signup = () => {
  const history = useHistory()

  // Name, email, password, and checked box props
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isProfessor, setIsProfessor] = useState(false)

  /** Error messages */
  enum SignupError {
    NONE = '',
    NAME = 'Please enter your name',
    EMAIL = 'Please enter your email',
    EMAIL_EXISTS = 'Email already exists!',
    PASS = 'Please enter a password',
  }
  const [nameError, setNameError] = useState(SignupError.NONE)
  const [emailError, setEmailError] = useState(SignupError.NONE)
  const [passwordError, setPasswordError] = useState(SignupError.NONE)

  const handleSignup = () => {
    // Fake signup
    setNameError(name === '' ? SignupError.NAME : SignupError.NONE)
    setEmailError(email === '' ? SignupError.EMAIL : SignupError.NONE)
    setPasswordError(password === '' ? SignupError.PASS : SignupError.NONE)
    if (name !== '' && email !== '' && password !== '' && isProfessor) {
      history.push('/dashboard')
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

  const checkboxLabelStyle = {
    fontWeight: '600',
    color: colors.darkpurple,
  }

  return (
    <StyledBackground>
      <StyledContainer>
        <StyledCenter>
          <StyledHeader>
            <StyledHeaderText>Sign up</StyledHeaderText>
            <StyledWelcomeText>Welcome to Zing!</StyledWelcomeText>
          </StyledHeader>
          <StyledFields>
            <NameField
              containerStyle={textContainerStyle}
              inputStyle={nameError ? textInputErrorStyle : textInputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
            />
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
            <Checkbox
              labelStyle={checkboxLabelStyle}
              checked={isProfessor}
              onChange={(e) => setIsProfessor(e.target.checked)}
              label="I am a professor or other groupmaker"
              required
            />
          </StyledFields>
          <PrimaryGradientButton label="Sign Up" onClick={handleSignup} />
        </StyledCenter>
      </StyledContainer>
    </StyledBackground>
  )
}
