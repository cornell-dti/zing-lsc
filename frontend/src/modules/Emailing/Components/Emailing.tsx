import React from 'react'
import axios from 'axios'
import { getAuth } from 'firebase/auth'

// zing imports
import { API_ROOT } from '@core'
import {
  StyledContainer,
  StyledLogo,
  StyledLogoWrapper,
  StyledText,
} from 'Emailing/Styles/Emailing.style'

// external imports
import { Box, Button } from '@mui/material'

// 'www.zing.com/email' route
export const Emailing = () => {
  // 1. logged in user info
  let auth = getAuth()
  let user = auth.currentUser
  let email = user?.email

  const sendEmail = async () => {
    // 2. obtaining auth token from local storage
    const msAuthToken = localStorage.getItem('authToken') || ' '
    console.log('access tok is ' + msAuthToken)

    // 3. request to the backend to send mail
    axios({
      method: 'post',
      url: `${API_ROOT}/email/send`,
      data: {
        authToken: msAuthToken,
        emailAddress: email,
      },
    }).then((res) => {
      // 4. reading response for success or failure
      console.log(res)
    })
  }

  return (
    <StyledContainer>
      <StyledLogoWrapper>
        <StyledLogo />
        <StyledText> Zing </StyledText>
      </StyledLogoWrapper>
      <Box
        display="flex"
        flex-direction="row"
        align-items=" center"
        justifyContent="space-between"
      >
        <Button onClick={() => sendEmail()} sx={{ height: '40px', mt: '10px' }}>
          send Email
        </Button>
      </Box>
    </StyledContainer>
  )
}
