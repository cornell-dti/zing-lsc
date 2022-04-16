import React, { FunctionComponent } from 'react'
import { StepTemplateProps } from 'Survey/Types'
import {
  StyledWrapper,
  StyledFullPanel,
} from 'Survey/Styles/StepTemplate.style'
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
    <Box
      sx={{
        backgroundColor: 'white',
        width: '80%',
        height: '90%',
      }}
    >
      <ProgressBar step={stepNumber} total={totalSteps} />
      <StyledFullPanel>
        <StyledWrapper style={{ height: '85%', overflow: 'scroll' }}>
          {children}
        </StyledWrapper>

        <StyledWrapper style={{ height: '15%', color: '#815ed4' }}>
          <div style={{ textAlign: 'center' }}>
            <IconButton className="prev" onClick={handlePrev} color="secondary">
              <ArrowBack />
            </IconButton>
            <div>Prev</div>
          </div>

          <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
            <IconButton className="next" onClick={handleNext}>
              {<ArrowForward />}
            </IconButton>
            <div>Next</div>
          </div>
        </StyledWrapper>
      </StyledFullPanel>
    </Box>
  )
}
