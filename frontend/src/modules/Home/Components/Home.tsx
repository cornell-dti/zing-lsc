import React from 'react'

import {
  StyledBackground,
  StyledButtonsWrapper,
  StyledContainer,
  StyledHeaderText,
  StyledLeftPanel,
  StyledRightPanel,
  StyledTeacherPic,
  StyledTitleWrapper,
  StyledWelcomeText,
  StyledWhiteActionText,
} from 'Home/Styles/Home.style'
import Button from '@mui/material/Button'
import { signInWithGoogle } from '@fire'
import { useHistory } from 'react-router'
import { ReactComponent as Google } from '@assets/img/googleicon.svg'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

function GoogleIcon(props: SvgIconProps) {
  return <SvgIcon inheritViewBox component={Google} {...props} />
}

export const Home = () => {
  const history = useHistory()

  return (
    <StyledBackground>
      <StyledContainer>
        <StyledLeftPanel>
          <StyledWhiteActionText>
            Connect students, create Zings
          </StyledWhiteActionText>
          <StyledTeacherPic />
        </StyledLeftPanel>
        <StyledRightPanel>
          <StyledTitleWrapper>
            <StyledHeaderText>Hi,</StyledHeaderText>
            <StyledWelcomeText>
              Let's form study partner groups!
            </StyledWelcomeText>
          </StyledTitleWrapper>
          <StyledButtonsWrapper>
            <Button
              startIcon={<GoogleIcon />}
              sx={{
                pl: 3,
                background:
                  'linear-gradient(288.93deg, #C693EE 2.66%, #7C5ED3 69.33%)',
              }}
              onClick={() => {
                signInWithGoogle()
                  .then(() => {
                    history.push('/dashboard')
                  })
                  .catch(() => {})
              }}
            >
              Log In with Google
            </Button>
          </StyledButtonsWrapper>
        </StyledRightPanel>
      </StyledContainer>
    </StyledBackground>
  )
}
