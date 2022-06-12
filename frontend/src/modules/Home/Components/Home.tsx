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
import Button from '@mui/material/Button'
import { adminSignIn } from '@fire'
// import { ReactComponent as Google } from '@assets/img/googleicon.svg'
import { ReactComponent as Microsoft } from '@assets/img/microsofticon.svg'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { Box } from '@mui/material'
import teacher from '@assets/img/teacher.svg'

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
            Connect students, create groups
          </StyledWhiteActionText>
          <Button
            color="secondary"
            variant="outlined"
            sx={{
              width: 300,
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
              width: 300,
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
          <Box display="flex" flexDirection="column" mt={-10} zIndex={1}></Box>
        </StyledRightPanel>
      </StyledContainer>
    </StyledBackground>
  )
}
