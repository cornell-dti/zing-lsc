import {
  StyledContainer,
  StyledCongratulationsWrapper,
  StyledCongratulationsText,
  StyledFullPanel,
  StyledCheck,
  StyledContactText,
  StyledContactWrapper,
} from 'Survey/Styles/StepFinal.style'
import { StepFinalProps } from 'Survey/Types'
import { Button } from '@mui/material'
import check from '@assets/img/whitecheckmark.svg'
import warn from '@assets/img/warnbutton.svg'
import xmark from '@assets/img/xbutton.svg'

export const StepFinal = ({
  success,
  submissionResponse,
  errorMsg,
}: StepFinalProps) => {
  const showWarning = success && submissionResponse.failed.length !== 0

  return (
    <StyledContainer>
      <StyledFullPanel>
        <StyledCongratulationsWrapper>
          <StyledCheck src={showWarning ? warn : success ? check : xmark} />
          {showWarning ? (
            <StyledCongratulationsText>
              Some course(s) could not be found in roster{' '}
              {submissionResponse.roster}. Please double-check that they were
              spelled correctly, and resubmit the form if needed.
              <br />
              <StyledContactText>
                Courses added successfully:{' '}
                {submissionResponse.added.join(', ') || 'none'}
                <br />
                Courses not added: {submissionResponse.failed.join(', ')}
              </StyledContactText>
            </StyledCongratulationsText>
          ) : success ? (
            <StyledCongratulationsText>
              Congratulations on completing the form! You should receive an
              email with your team members shortly.
              <br />
              <StyledContactText>
                Courses added: {submissionResponse.added.join(', ')}
              </StyledContactText>
            </StyledCongratulationsText>
          ) : (
            <StyledCongratulationsText>
              Something went wrong.
              <br />
              <StyledContactText>Error: {errorMsg}</StyledContactText>
            </StyledCongratulationsText>
          )}
        </StyledCongratulationsWrapper>
        <Button
          color="secondary"
          variant="outlined"
          href="https://lsc.cornell.edu/"
          sx={{
            width: '14em',
            fontSize: { sm: 14, md: 22 },
            mt: '1.25em',
            boxShadow: 1,
          }}
        >
          Back to home
        </Button>
        <StyledContactWrapper>
          <StyledContactText>
            Contact lscstudypartners@cornell.edu with any questions.
          </StyledContactText>
        </StyledContactWrapper>
      </StyledFullPanel>
    </StyledContainer>
  )
}
