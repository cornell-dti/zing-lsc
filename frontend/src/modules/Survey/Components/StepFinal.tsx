import React from 'react'

import {
  StyledContainer,
  StyledLogo,
  StyledCongratulationsWrapper,
  StyledLogoWrapper,
  StyledCongratulationsText,
  StyledFullPanel,
  StyledCheck,
  StyledContactText,
  StyledContactWrapper,
} from 'Survey/Styles/StepFinal.style'
import { StepFinalProps } from 'Survey/Types'
import check from '@assets/img/whitecheckmark.svg'
import xmark from '@assets/img/xbutton.svg'

export const StepFinal = ({ success, errorMsg }: StepFinalProps) => {
  return (
    <StyledContainer>
      <StyledFullPanel>
        <StyledLogoWrapper>
          <StyledCongratulationsWrapper>
            <StyledCheck src={success ? check : xmark} />
            {success ? (
              <StyledCongratulationsText>
                {' '}
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
        </StyledLogoWrapper>
        <StyledContactWrapper>
          <StyledContactText>
            Contact lscstudypartners@cornell.edu with any questions.
          </StyledContactText>
        </StyledContactWrapper>
      </StyledFullPanel>
    </StyledContainer>
  )
}
