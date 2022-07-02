import React, { FunctionComponent } from 'react'
import { StepTemplateProps } from 'Survey/Types'
import { StyledWrapper } from 'Survey/Styles/StepTemplate.style'
import { ProgressBar } from '@core/Components/index'
import { IconButton, Typography, CircularProgress, Box } from '@mui/material'
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
    <Box
      sx={{
        background: '#fff',
        width: {
          xs: '100%',
          lg: '80%',
        },
        height: {
          xs: '100%',
          lg: '90%',
        },
        maxWidth: '1440px',
        position: 'relative',
      }}
    >
      <ProgressBar step={stepNumber} total={totalSteps} />
      <StyledWrapper>{children}</StyledWrapper>
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'row',
          width: '100%',
          paddingBottom: '20%',
          paddingTop: '50px',
          '& > *': {
            position: {
              xs: 'absolute',
              lg: 'static',
            },
            textAlign: 'center',
            color: '#815ed4',
          },
        }}
      >
        <Box
          sx={{
            left: '10%',
            marginLeft: '15%',
          }}
        >
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
        </Box>

        <Box
          sx={{
            right: '10%',
            marginRight: '15%',
            marginLeft: {
              lg: 'auto',
            },
          }}
        >
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
        </Box>
      </Box>
    </Box>
  )
}
