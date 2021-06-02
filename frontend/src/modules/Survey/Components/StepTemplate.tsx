import React, { FunctionComponent } from 'react'
import { StepTemplateProps } from 'Survey/Types'
import {
  StyledContainer,
  StyledWrapper,
  StyledLogo,
  StyledFullPanel,
  StyledPrevButton,
  StyledNextButton,
  StyledFullPanelNoPadding,
  StyledHeaderWrapper,
  StyledLogoWrapper,
} from 'Survey/Styles/StepTemplate.style'
import prev from '@assets/img/prev.svg'
import next from '@assets/img/next.svg'
import ProgressBar from './UIElements/ProgressBar'
import {
  getYoungestGradYear,
  getOldestGradYear,
} from 'Survey/Components/FuncsAndConsts/SurveyFunctions'

export const StepTemplate: FunctionComponent<StepTemplateProps> = ({
  currentAnswer,
  stepNumber,
  totalSteps,
  gotoPrevStep,
  gotoNextStep,
  children,
  setShowError,
}) => {
  const youngestYear = getYoungestGradYear()
  const oldestYear = getOldestGradYear()

  const handlePrev = () => {
    setShowError(false)
    gotoPrevStep()
  }

  // form validation
  const handleNext = () => {
    if (currentAnswer === '') {
      setShowError(true)
      return
    }
    if (stepNumber === 3) {
      const inputtedYear = Number(currentAnswer)
      if (
        inputtedYear - youngestYear >= 1 || // youngest year bound
        inputtedYear - oldestYear <= -1 || // oldest year bound
        String(inputtedYear) !== currentAnswer // check for alphabetical letters
      ) {
        setShowError(true)
        return
      }
    }
    setShowError(false)
    gotoNextStep()
  }

  return (
    <StyledContainer>
      <StyledFullPanelNoPadding>
        <ProgressBar stepNumber={stepNumber} totalSteps={totalSteps} />
        <StyledFullPanel>
          <StyledHeaderWrapper>
            {/* <p>{String(isShowingError)}</p> */}
            <StyledLogoWrapper style={{ height: '8%' }}>
              <StyledLogo />
            </StyledLogoWrapper>
          </StyledHeaderWrapper>
          <StyledWrapper style={{ height: '82%' }}>{children}</StyledWrapper>
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
