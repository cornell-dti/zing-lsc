import React from 'react'
import { Link } from 'react-router-dom'

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
// import { PrimaryGradientButton, WhiteButton } from '@core/Components'
import Button from '@mui/material/Button'

export const Home = () => {
  // const history = useHistory()

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
            <Button
              color="secondary"
              variant="outlined"
              component={Link}
              to="/login"
            >
              Log In
            </Button>
            <Button color="primary" component={Link} to="/signup">
              Sign Up
            </Button>
          </StyledButtonsWrapper>
        </StyledRightPanel>
      </StyledContainer>
    </StyledBackground>
  )
}
