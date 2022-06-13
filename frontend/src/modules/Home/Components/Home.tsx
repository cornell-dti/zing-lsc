import React from 'react'
import {
  StyledBackground,
  StyledContainer,
  StyledHeaderText,
  StyledLeftPanel,
  StyledRightPanel,
  StyledWelcomeText,
  StyledWhiteActionText,
} from 'Home/Styles/Home.style'
import { adminSignIn } from '@fire'
// import { ReactComponent as Google } from '@assets/img/googleicon.svg'
import { ReactComponent as Microsoft } from '@assets/img/microsofticon.svg'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { Box, Button, Typography } from '@mui/material'
import matchimg from '@assets/img/matching.svg'

// function GoogleIcon(props: SvgIconProps) {
//   return <SvgIcon inheritViewBox component={Google} {...props} />
// }

function MicrosoftIcon(props: SvgIconProps) {
  return <SvgIcon inheritViewBox component={Microsoft} {...props} />
}

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
              width: '15em',
              fontSize: { sm: 14, md: 22 },
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
              width: '15em',
              fontSize: { sm: 14, md: 22 },
            }}
            onClick={() => {
              adminSignIn().catch(() => {})
            }}
          >
            Student Login
          </Button>
        </StyledLeftPanel>
        <StyledRightPanel>
          <Box sx={{ maxWidth: '100%', mt: 8 }}>
            <img src={matchimg} alt="matching" width="60%" />
          </Box>
        </StyledRightPanel>
      </StyledContainer>
    </StyledBackground>
  )
}
