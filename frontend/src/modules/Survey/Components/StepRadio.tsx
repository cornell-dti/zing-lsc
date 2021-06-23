import React from 'react'

import {
  StyledContainer,
  StyledQuestionText,
  StyledRadioButtonsWrapper,
  StyledErrorWrapper,
  StyledErrorIcon,
  StyledErrorText,
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
      <StyledQuestionText>
        {question.question}
      </StyledQuestionText>
      <StyledRadioButtonsWrapper>
        {showError ? (
          <StyledErrorWrapper>
            <StyledErrorIcon />
            <StyledErrorText>Please select an item to continue</StyledErrorText>
          </StyledErrorWrapper>
        ) : null}
        <StyledContainer>
          {Object.entries(question.answers).map(([value, fullDescription]) => (
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
          ))}
        </StyledContainer>
      </StyledRadioButtonsWrapper>
    </StyledContainer>
  )
}
