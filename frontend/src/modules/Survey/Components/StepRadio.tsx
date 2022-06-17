import React from 'react'

import {
  StyledContainer,
  StyledQuestionText,
  StyledRadioButtonsWrapper,
  StyledErrorWrapper,
  StyledErrorIcon,
  StyledErrorText,
  StyledFieldSet,
} from 'Survey/Styles/StepRadio.style'
import { RadioButton } from '@core'
import { StepProps } from 'Survey/Types/StepProps'

export const StepRadio = ({
  showError,
  currentAnswer,
  setAnswer,
  question,
}: StepProps) => {
  return (
    <StyledContainer>
      <main>
        <StyledQuestionText>{question.question}</StyledQuestionText>
        <StyledRadioButtonsWrapper>
          {showError ? (
            <StyledErrorWrapper>
              <StyledErrorIcon />
              <StyledErrorText>
                Please select an item to continue
              </StyledErrorText>
            </StyledErrorWrapper>
          ) : null}
          <StyledContainer>
            <StyledFieldSet>
              <legend>
                {/**
                 * TODO
                 * do we want a legend here or no?  */}
              </legend>
              {Object.entries(question.answers).map(
                ([value, fullDescription]) => (
                  <RadioButton
                    currentAnswer={currentAnswer}
                    onClick={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAnswer(e.target.value)
                    }
                    value={value}
                    label={fullDescription}
                    name="RadioButtons"
                    key={value}
                  />
                )
              )}
            </StyledFieldSet>
          </StyledContainer>
        </StyledRadioButtonsWrapper>
      </main>
    </StyledContainer>
  )
}
