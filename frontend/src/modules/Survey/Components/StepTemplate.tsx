import React, { FunctionComponent } from 'react'
import { StepTemplateProps } from 'Survey/Types'
import {
  StyledWrapper,
  StyledFullPanel,
} from 'Survey/Styles/StepTemplate.style'
import { ProgressBar } from '@core/Components/index'
import { IconButton, Box } from '@mui/material'
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material'

export const StepTemplate: FunctionComponent<StepTemplateProps> = ({
  isStepValid,
  stepNumber,
  totalSteps,
  gotoPrevStep,
  gotoNextStep,
  children,
}) => {
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
        <StyledWrapper style={{ height: '85%', overflowY: 'scroll' }}>
          {children}
        </StyledWrapper>

        <StyledWrapper style={{ height: '15%', margin: '0% 2%' }}>
          <Box sx={{ textAlign: 'center', color: 'purple.100' }}>
            <IconButton
              className="next"
              onClick={gotoPrevStep}
              color="secondary"
              sx={{ boxShadow: 3 }}
              aria-label="previous button"
            >
              <ArrowBack />
            </IconButton>
            <br />
            Prev
          </Box>

          <Box
            sx={{
              marginLeft: 'auto',
              textAlign: 'center',
              color: 'purple.100',
            }}
          >
            <IconButton
              className="next"
              onClick={gotoNextStep}
              disabled={!isStepValid}
              sx={{ boxShadow: 3 }}
              aria-label="next button"
            >
              {stepNumber === totalSteps ? <Check /> : <ArrowForward />}
            </IconButton>
            <br />
            {stepNumber === totalSteps ? 'Finish!' : 'Next'}
          </Box>
        </StyledWrapper>
      </StyledFullPanel>
    </Box>
  )
}
