import React from 'react'

import {
  StyledContainer,
  StyledQuestionText,
  StyledRadioButtonsWrapper,
  StyledFieldSet,
} from 'Survey/Styles/StepRadio.style'
import { RadioButton } from '@core'
import { StepProps } from 'Survey/Types/StepProps'

export const StepRadio = ({
  currentAnswer,
  setAnswer,
  question,
}: StepProps) => {
  return (
    <StyledContainer>
      <StyledQuestionText>{question.question}</StyledQuestionText>
      <StyledRadioButtonsWrapper>
        <StyledContainer>
          <StyledFieldSet>
            <legend></legend>
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
    </StyledContainer>
  )
}
