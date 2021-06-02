import React, { useState, FunctionComponent } from 'react'
import {
  StyledContainer,
  StyledQuestionText,
  StyledRadioButtonsWrapper,
  StyledRadioButtons,
  StyledErrorWrapper,
  StyledErrorIcon,
  StyledErrorText,
} from 'Survey/Styles/StepRadio.style'
import { StepProps } from 'Survey/Types/StepProps'

export const StepRadio: FunctionComponent<StepProps> = ({
  showError,
  currentAnswer,
  setAnswer,
  questionList,
  key,
}: StepProps) => {
  const [hasSelectedAns, setHasSelectedAns] = useState(false)
  function handleClick(arg: string) {
    console.warn(arg)
    setHasSelectedAns(true)
    setAnswer(arg)
  }
  return (
    <StyledContainer>
      <StyledQuestionText>
        {questionList !== undefined ? questionList[0] : 'Error'}
      </StyledQuestionText>
      <StyledRadioButtonsWrapper>
        {showError ? (
          <StyledErrorWrapper>
            <StyledErrorIcon />
            <StyledErrorText>Please select an item to continue</StyledErrorText>
          </StyledErrorWrapper>
        ) : null}
        <StyledRadioButtons
          currentAnswer={currentAnswer}
          values={questionList}
          onClick={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleClick(e.target.value)
          }
          key={key}
        />
      </StyledRadioButtonsWrapper>
    </StyledContainer>
  )
}
