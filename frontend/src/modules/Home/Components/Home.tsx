import React from 'react'
import { useHistory } from 'react-router-dom'

import {
  StyledBackground,
  StyledButtonsWrapper,
  StyledContainer,
  StyledHeaderText,
  StyledLeftPanel,
  StyledLogo,
  StyledRightPanel,
  StyledTeacherPic,
  StyledTitleWrapper,
  StyledWelcomeText,
  StyledWhiteActionText,
} from 'Home/Styles/Home.style'
import { PrimaryGradientButton, WhiteButton } from '@core/Components'

export const Home = () => {
  const history = useHistory()

  return (
    <StyledBackground>
      <StyledContainer>
        <StyledLeftPanel>
          <StyledLogo />
          <StyledWhiteActionText>
            Create groups, connect students
          </StyledWhiteActionText>
          <StyledTeacherPic />
        </StyledLeftPanel>
        <StyledRightPanel>
          <StyledTitleWrapper>
            <StyledHeaderText>Hi,</StyledHeaderText>
            <StyledWelcomeText>Welcome to Zing!</StyledWelcomeText>
          </StyledTitleWrapper>
          <StyledButtonsWrapper>
            <WhiteButton
              label="Log In"
              onClick={() => {
                history.push('/login')
              }}
            />
            <PrimaryGradientButton
              label="Sign Up"
              onClick={() => {
                history.push('/signup')
              }}
            />
          </StyledButtonsWrapper>
        </StyledRightPanel>
      </StyledContainer>
    </StyledBackground>
  )
}
