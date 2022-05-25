import React, { useState } from 'react'
import { IconButton, Box } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'

import { colors, EmailField, NameField } from '@core'
import {
  StyledContainer,
  StyledLeftPanel,
  StyledRightPanel,
  StyledFields,
  StyledWhiteActionText,
  StyledTeamPic,
  StyledTitleWrapper,
  StyledHeaderText,
  StyledWelcomeText,
  StyledTextFieldWrapper,
} from 'Survey/Styles/StepBegin.style'
import { StepBeginProps } from 'Survey/Types'

export const StepBegin = ({
  name,
  email,
  setName,
  setEmail,
  gotoNextStep,
}: StepBeginProps) => {
  /** Enums for the 4 types of validation errors that can occur on step 0 **/
  const errorEnum = {
    NONE: '',
    NAME: 'Please enter your name',
    EMAIL: 'Please enter your email',
    BOTH: 'Please enter your name and email',
  }
  /** the current error encountered */
  const [error, setError] = useState(errorEnum.NONE)

  const textContainerStyle = {
    margin: '0.75rem 0',
  }

  const nameTextInputStyle = {
    fontWeight: '500',
    fontSize: '24px',
    color:
      error === errorEnum.NAME || error === errorEnum.BOTH
        ? colors.red
        : colors.darkpurple,
  }

  const emailTextInputStyle = {
    fontWeight: '500',
    fontSize: '24px',
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
        <StyledWhiteActionText>
          LSC can help match you with study partners for your classes!
        </StyledWhiteActionText>
        <StyledTeamPic />
      </StyledLeftPanel>
      <StyledRightPanel>
        <StyledTitleWrapper>
          <StyledHeaderText>Hi,</StyledHeaderText>
          <StyledWelcomeText>Find study partners!</StyledWelcomeText>
        </StyledTitleWrapper>
        <StyledFields>
          <StyledTextFieldWrapper
            style={{
              marginBottom: calculatePadding(errorEnum.NAME) + 'rem',
            }}
          >
            <NameField
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
            <EmailField
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
        <Box sx={{ marginLeft: 'auto', textAlign: 'center' }}>
          <IconButton
            className="next"
            onClick={handleNext}
            // disabled={error != errorEnum.NONE}
          >
            <ArrowForward />
          </IconButton>
          <br />
          Next
        </Box>
      </StyledRightPanel>
    </StyledContainer>
  )
}
