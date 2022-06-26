import React, { FunctionComponent } from 'react'
import { StepTemplateProps } from 'Survey/Types'
import {
  StyledWrapper,
  ButtonsContainer,
  BackButton,
  NextButton,
  StyledFullPanel,
  StepContainer,
} from 'Survey/Styles/StepTemplate.style'
import { ProgressBar } from '@core/Components/index'
import { IconButton, Box, Typography, CircularProgress } from '@mui/material'
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material'

export const StepTemplate: FunctionComponent<StepTemplateProps> = ({
  isStepValid,
  stepNumber,
  totalSteps,
  gotoPrevStep,
  gotoNextStep,
  isSubmittingSurvey,
  children,
}) => {
  const showFinish = stepNumber === totalSteps

  return (
    <StepContainer>
      <ProgressBar step={stepNumber} total={totalSteps} />
      <StyledWrapper>{children}</StyledWrapper>
      <ButtonsContainer>
        <BackButton>
          <IconButton
            className="next"
            onClick={gotoPrevStep}
            color="secondary"
            sx={{ boxShadow: 3 }}
            aria-label="previous button"
          >
            <ArrowBack />
          </IconButton>
          <Typography id="previous">Prev</Typography>
        </BackButton>

        <NextButton>
          <IconButton
            onClick={gotoNextStep}
            disabled={!isStepValid || isSubmittingSurvey}
            sx={{ boxShadow: 3 }}
            aria-labelledby="next"
          >
            {isSubmittingSurvey ? (
              <CircularProgress size={24} />
            ) : showFinish ? (
              <Check />
            ) : (
              <ArrowForward />
            )}
          </IconButton>
          <Typography id="next">{showFinish ? 'Finish!' : 'Next'}</Typography>
        </NextButton>
      </ButtonsContainer>
    </StepContainer>
  )
}
