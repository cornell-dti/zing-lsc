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
import xmark from '@assets/img/xbutton.svg'

export const StepFinal = ({ success, errorMsg }: StepFinalProps) => {
  return (
    <StyledContainer>
      <StyledFullPanel>
        <StyledCongratulationsWrapper>
          <StyledCheck src={success ? check : xmark} />
          {success ? (
            <StyledCongratulationsText>
              Congratulations on completing the form! You should receive an
              email with your team members shortly.
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
          }}
        >
          Back to Home
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
