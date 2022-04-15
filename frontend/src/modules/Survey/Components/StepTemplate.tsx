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
import { ProgressBar } from '@core/Components/index'
import { IconButton, Box } from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'

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
    <Box sx={{ backgroundColor: 'white' }}>
      <ProgressBar step={stepNumber} total={totalSteps} />
      <StyledFullPanel>
        <StyledWrapper style={{ height: '90%', display: 'flex' }}>
          {children}
        </StyledWrapper>
        <StyledWrapper style={{ height: '10%' }}>
          <IconButton className="prev" onClick={handlePrev}>
            <ArrowBack />
          </IconButton>
          <IconButton
            className="next"
            onClick={handleNext}
            sx={{ marginLeft: 'auto' }}
          >
            {<ArrowForward />}
          </IconButton>
        </StyledWrapper>
      </StyledFullPanel>
    </Box>
  )
}
