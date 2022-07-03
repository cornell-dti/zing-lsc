import {
  StyledCongratulationsWrapper,
  StyledLogoWrapper,
  StyledCheck,
  StyledContactText,
} from 'Survey/Styles/StepFinal.style'

import { Box, Typography } from '@mui/material'
import { StepFinalProps } from 'Survey/Types'
import check from '@assets/img/whitecheckmark.svg'
import warn from '@assets/img/warnbutton.svg'
import xmark from '@assets/img/xbutton.svg'

export const StepFinal = ({
  success,
  submissionResponse,
  errorMsg,
}: StepFinalProps) => {
  const showWarning = success && submissionResponse.failed.length !== 0

  const Success = () => {
    return (
      <Box
        sx={{
          width: {
            xs: '100%',
            lg: '73%',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '2.25rem',
            fontWeight: '500',
            color: '#fff',
          }}
        >
          Congratulations on completing the form! You should receive an email
          with your team members shortly.
        </Typography>
        <StyledContactText>
          Courses added: {submissionResponse.added.join(', ')}
        </StyledContactText>
      </Box>
    )
  }

  const Warning = () => {
    return (
      <Box
        sx={{
          width: {
            xs: '100%',
            lg: '73%',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '2.25rem',
            fontWeight: '500',
            color: '#fff',
          }}
        >
          Some course(s) could not be found in roster
          {submissionResponse.roster}. Please double-check that they were
          spelled correctly, and resubmit the form if needed.
        </Typography>
        <StyledContactText>
          Courses added successfully:
          {submissionResponse.added.join(', ') || 'none'}
          <br />
          Courses not added: {submissionResponse.failed.join(', ')}
        </StyledContactText>
      </Box>
    )
  }

  const Error = () => {
    return (
      <Box
        sx={{
          width: {
            xs: '100%',
            lg: '73%',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '2.25rem',
            fontWeight: '500',
            color: '#fff',
          }}
        >
          Something went wrong.
        </Typography>
        <StyledContactText> Error: {errorMsg}</StyledContactText>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        background: '#815ed4',
        display: 'flex',
        flexFlow: 'column nowrap',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingBottom: '100px',
      }}
    >
      <StyledLogoWrapper>
        <StyledCongratulationsWrapper>
          <StyledCheck src={showWarning ? warn : success ? check : xmark} />
          {showWarning && <Warning />}
          {success && <Success />}
          {!success && <Error />}
        </StyledCongratulationsWrapper>
      </StyledLogoWrapper>
      <Typography
        sx={{
          fontWeight: '400',
          color: '#fff',
          fontSize: '1.5rem',
          margin: '10% 5%',
        }}
      >
        Contact{' '}
        <a href="mailto:lscstudypartners@cornell.edu">
          lscstudypartners@cornell.edu
        </a>{' '}
        with any questions.
      </Typography>
    </Box>
  )
}
