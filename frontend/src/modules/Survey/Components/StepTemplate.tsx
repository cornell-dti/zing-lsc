import React, { FunctionComponent } from 'react'
import { StepTemplateProps } from 'Survey/Types'
import {
  StyledContainer,
  StyledWrapper,
  StyledFullPanel,
  StyledPrevButton,
  StyledNextButton,
  StyledFullPanelNoPadding,
} from 'Survey/Styles/StepTemplate.style'
import prev from '@assets/img/prev.svg'
import next from '@assets/img/next.svg'
import { ProgressBar } from '@core/Components/ProgressBar'

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
    <StyledContainer>
      <StyledFullPanelNoPadding>
        <ProgressBar step={stepNumber} total={totalSteps} />
        <StyledFullPanel>
          <StyledWrapper style={{ height: '90%' }}>{children}</StyledWrapper>
          <StyledWrapper style={{ height: '10%' }}>
            <StyledPrevButton
              className="prev"
              src={prev}
              onClick={handlePrev}
            />
            <StyledNextButton
              className="next"
              src={next}
              onClick={handleNext}
            />
          </StyledWrapper>
        </StyledFullPanel>
      </StyledFullPanelNoPadding>
    </StyledContainer>
  )
}
