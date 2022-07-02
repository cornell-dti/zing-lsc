import {
  StyledCongratulationsWrapper,
  StyledLogoWrapper,
  StyledCongratulationsText,
  StyledCheck,
  StyledContactText,
  StyledContactWrapper,
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
      <StyledCongratulationsText>
        Congratulations on completing the form! You should receive an email with
        your team members shortly.
        <br />
        <StyledContactText>
          Courses added: {submissionResponse.added.join(', ')}
        </StyledContactText>
      </StyledCongratulationsText>
    )
  }

  const Warning = () => {
    return (
      <StyledCongratulationsText>
        Some course(s) could not be found in roster {submissionResponse.roster}.
        Please double-check that they were spelled correctly, and resubmit the
        form if needed.
        <br />
        <StyledContactText>
          Courses added successfully:
          {submissionResponse.added.join(', ') || 'none'}
          <br />
          Courses not added: {submissionResponse.failed.join(', ')}
        </StyledContactText>
      </StyledCongratulationsText>
    )
  }

  const Error = () => {
    return (
      <StyledCongratulationsText>
        <Typography> Something went wrong. </Typography>
        <StyledContactText> Error: {errorMsg}</StyledContactText>
      </StyledCongratulationsText>
    )
  }

  return (
    <Box
      sx={{
        background: '#815ed4',
        display: 'flex',
        flexFlow: 'row wrap',
        width: '100vw',
        height: '100vh',
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
      <StyledContactWrapper>
        <StyledContactText>
          Contact lscstudypartners@cornell.edu with any questions.
        </StyledContactText>
      </StyledContactWrapper>
    </Box>
  )
}
