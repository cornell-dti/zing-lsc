import React, { useState } from 'react'

import { colors } from '@core'
import {
  StyledContainer,
  StyledLeftPanel,
  StyledRightPanel,
  StyledFields,
  StyledLogo,
  StyledWhiteActionText,
  StyledTeamPic,
  StyledTitleWrapper,
  StyledHeaderText,
  StyledWelcomeText,
  StyledNameField,
  StyledEmailField,
  StyledTextFieldWrapper,
} from 'Survey/Styles/Step0.style'
import { GetConnectedButton } from 'Survey/Components/UIElements/GetConnectedButton'
import { Step0Props } from 'Survey/Types'

export const Step0 = ({
  name,
  email,
  setName,
  setEmail,
  gotoNextStep,
}: Step0Props) => {
  /** Enums for the 4 types of validation errors that can occur on step 0 **/
  const errorEnum = {
    NONE: '',
    NAME: 'Please enter your name',
    EMAIL: 'Please enter your email',
    BOTH: 'Please enter your name and email',
  }
  /** the current error encountered */
  const [error, setError] = useState(errorEnum.NONE)
  /** color to be passed */
  const [nameColor, setNameColor] = useState(colors.darkpurple)
  const [emailColor, setEmailColor] = useState(colors.darkpurple)

  const textContainerStyle = {
    margin: '0.75rem 0',
  }

  const nameTextInputStyle = {
    fontWeight: '600',
    color:
      error === errorEnum.NAME || error === errorEnum.BOTH
        ? colors.red
        : colors.darkpurple,
  }

  const emailTextInputStyle = {
    fontWeight: '600',
    color:
      error === errorEnum.EMAIL || error === errorEnum.BOTH
        ? colors.red
        : colors.darkpurple,
  }

  function calculatePadding(nameOrEmail: string): string {
    if (error === errorEnum.BOTH || error === nameOrEmail) {
      return '0'
    } else {
      return '1.4'
    }
  }

  function handleNext() {
    // TODO: change this to some regex magic @Shi Chong
    if (name === '' && email === '') {
      console.log('setting both red')
      setError(errorEnum.BOTH)
      return
    }
    if (name === '') {
      console.log('setting name red')
      setError(errorEnum.NAME)
      return
    }
    // TODO: change this to some regex magic @Shi Chong
    if (email === '') {
      console.log('setting email red')
      setError(errorEnum.EMAIL)
      return
    }
    setError(errorEnum.NONE)
    gotoNextStep()
  }

  return (
    <StyledContainer>
      <StyledLeftPanel>
        <StyledLogo />
        <StyledWhiteActionText>
          Connect with your classmates
        </StyledWhiteActionText>
        <StyledTeamPic />
      </StyledLeftPanel>
      <StyledRightPanel>
        <StyledTitleWrapper>
          <StyledHeaderText>Hi,</StyledHeaderText>
          <StyledWelcomeText>Welcome to Zing!</StyledWelcomeText>
        </StyledTitleWrapper>
        <StyledFields>
          <StyledTextFieldWrapper
            style={{
              marginBottom: calculatePadding(errorEnum.NAME) + 'rem',
            }}
          >
            <StyledNameField
              key={'name'}
              MuiColor={nameColor}
              containerStyle={textContainerStyle}
              inputStyle={nameTextInputStyle}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              // TODO: add extra thing in conditional so that when they type something that is valid, the error goes away
              error={
                error === errorEnum.NAME || error === errorEnum.BOTH
                  ? error
                  : ''
              }
            />
          </StyledTextFieldWrapper>
          <StyledTextFieldWrapper
            style={{
              marginBottom: calculatePadding(errorEnum.EMAIL) + 'rem',
            }}
          >
            <StyledEmailField
              key={'email'}
              MuiColor={emailColor}
              containerStyle={textContainerStyle}
              inputStyle={emailTextInputStyle}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              error={
                error === errorEnum.EMAIL || error === errorEnum.BOTH
                  ? error
                  : ''
              }
            />
          </StyledTextFieldWrapper>
        </StyledFields>
        <GetConnectedButton onClick={handleNext} />
      </StyledRightPanel>
    </StyledContainer>
  )
}
