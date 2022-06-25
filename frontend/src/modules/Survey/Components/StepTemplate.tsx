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
import { IconButton } from '@mui/material'
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material'

export const StepTemplate: FunctionComponent<StepTemplateProps> = ({
  isStepValid,
  stepNumber,
  totalSteps,
  gotoPrevStep,
  gotoNextStep,
  children,
  setShowError,
}) => {
  const handlePrev = () => {
    setShowError(false)
    gotoPrevStep()
  }

  const handleNext = () => {
    if (isStepValid) {
      setShowError(false)
      gotoNextStep()
    } else {
      setShowError(true)
    }
  }

  return (
    <StepContainer>
      <ProgressBar step={stepNumber} total={totalSteps} />
      <StyledFullPanel>
        <StyledWrapper>{children}</StyledWrapper>

        <ButtonsContainer>
          <BackButton>
            <IconButton
              className="next"
              onClick={handlePrev}
              color="secondary"
              sx={{ boxShadow: 3 }}
              aria-label="previous button"
            >
              <ArrowBack />
            </IconButton>
            <div>Prev</div>
          </BackButton>

          <NextButton>
            <IconButton
              className="next"
              onClick={handleNext}
              disabled={!isStepValid}
              sx={{ boxShadow: 3 }}
              aria-label="next button"
            >
              {stepNumber === totalSteps ? <Check /> : <ArrowForward />}
            </IconButton>
            <div>{stepNumber === totalSteps ? 'Finish!' : 'Next'}</div>
          </NextButton>
        </ButtonsContainer>
      </StyledFullPanel>
    </StepContainer>
  )
}
