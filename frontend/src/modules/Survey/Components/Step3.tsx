import React from 'react'
import { colors, h2 } from '@core'
import {
  StyledContainer,
  StyledText,
  StyledYearField,
  StyledErrorWrapper,
  StyledErrorText,
  StyledEverythingWrapper,
  StyledYearFieldWrapper,
} from 'Survey/Styles/Step3.style'
import { StepProps } from 'Survey/Types/StepProps'
import {
  getYoungestGradYear,
  getOldestGradYear,
} from 'Survey/Components/FuncsAndConsts/SurveyFunctions'

export const Step3 = ({ showError, setAnswer, currentAnswer }: StepProps) => {
  /** styling container for text in yearfield */
  const textContainerStyle = {
    margin: '0.75rem 0',
  }

  /** styling object for text in yearfield */
  const textInputStyle = {
    font: h2,
    fontWeight: 800,
    color: showError ? colors.red : colors.darkpurple,
    textAlign: 'center',
    root: {
      background: colors.white,
      borderRadius: 3,
      border: 0,
      height: 48,
      padding: '0 30px',
    },
  }

  return (
    <StyledContainer>
      <StyledText>When are you graduating?</StyledText>
      <StyledEverythingWrapper>
        {showError ? (
          <StyledErrorWrapper>
            <StyledErrorText>
              Please enter a year between {String(getOldestGradYear())} and
              {' ' + String(getYoungestGradYear())}
            </StyledErrorText>
          </StyledErrorWrapper>
        ) : null}
        <StyledYearFieldWrapper>
          <StyledYearField
            error={showError ? ' ' : ''}
            MuiColor={colors.darkpurple}
            fullWidth={true}
            key={'name'}
            containerStyle={textContainerStyle}
            inputStyle={textInputStyle}
            value={currentAnswer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAnswer(e.target.value)
            }
          />
        </StyledYearFieldWrapper>
      </StyledEverythingWrapper>
    </StyledContainer>
  )
}
