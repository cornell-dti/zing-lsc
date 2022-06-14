import React from 'react'
import {
  StyledBackground,
  StyledContainer,
  StyledLeftPanel,
  StyledRightPanel,
  StyledWhiteActionText,
} from 'Home/Styles/Home.style'
import { adminSignIn } from '@fire'
import { ReactComponent as Microsoft } from '@assets/img/microsofticon.svg'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { Box, Button, Typography } from '@mui/material'
import matchimg from '@assets/img/matching.svg'

export const Home = () => {
  return (
    <StyledBackground>
      <StyledContainer>
        <StyledLeftPanel>
          <StyledWhiteActionText>
            <Typography variant="h2" fontWeight={'600'}>
              Connect students. <br />
              Create groups.
            </Typography>
          </StyledWhiteActionText>
          <Button
            color="secondary"
            variant="outlined"
            sx={{
              width: '14em',
              fontSize: { sm: 14, md: 22 },
              mb: '1em',
            }}
            onClick={() => {
              adminSignIn().catch(() => {})
            }}
          >
            LSC Admin Login
          </Button>
          <Button
            color="primary"
            variant="outlined"
            sx={{
              width: '14em',
              fontSize: { sm: 14, md: 22 },
              borderColor: 'white',
              color: 'white',
            }}
            onClick={() => {
              adminSignIn().catch(() => {})
            }}
          >
            I'm a Student
          </Button>
        </StyledLeftPanel>
        <StyledRightPanel>
          <Box sx={{ mt: '12rem', ml: 5 }}>
            <img src={matchimg} alt="matching" width="60%" />
          </Box>
        </StyledRightPanel>
      </StyledContainer>
    </StyledBackground>
  )
}
