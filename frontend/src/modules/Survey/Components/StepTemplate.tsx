import React, { FunctionComponent } from 'react'
import { StepTemplateProps } from 'Survey/Types'
import {
  StyledWrapper,
  StyledFullPanel,
} from 'Survey/Styles/StepTemplate.style'
import { ProgressBar } from '@core/Components/index'
import { IconButton, Box, Typography } from '@mui/material'
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material'

export const StepTemplate: FunctionComponent<StepTemplateProps> = ({
  isStepValid,
  stepNumber,
  totalSteps,
  gotoPrevStep,
  gotoNextStep,
  children,
}) => {
  const showFinish = stepNumber === totalSteps

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
              onClick={gotoPrevStep}
              color="secondary"
              sx={{ boxShadow: 3 }}
              aria-labelledby="previous"
            >
              <ArrowBack />
            </IconButton>
            <Typography id="previous">Prev</Typography>
          </Box>

          <Box
            sx={{
              marginLeft: 'auto',
              textAlign: 'center',
              color: 'purple.100',
            }}
          >
            <IconButton
              onClick={gotoNextStep}
              disabled={!isStepValid}
              sx={{ boxShadow: 3 }}
              aria-labelledby="next"
            >
              {showFinish ? <Check /> : <ArrowForward />}
            </IconButton>
            <Typography id="next">{showFinish ? 'Finish!' : 'Next'}</Typography>
          </Box>
        </StyledWrapper>
      </StyledFullPanel>
    </Box>
  )
}
