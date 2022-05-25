import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import { getAuth, OAuthProvider, signInWithPopup } from 'firebase/auth'

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

// /email route
export const Emailing = () => {
  let auth = getAuth()

  const getAuthToken = async () => {
    let accessToken
    const provider = new OAuthProvider('microsoft.com')
    provider.addScope('mail.send')
    const result = await signInWithPopup(auth, provider)
    // user is signed in
    // IdP data available in result.additionalUserInfo.profile

    // get OAuth access token and ID Token
    const credential = OAuthProvider.credentialFromResult(result)
    accessToken = credential?.accessToken
    return accessToken
  }

  const sendEmail = async () => {
    const msAuthToken = await getAuthToken()
    console.log('access tok is ' + msAuthToken)
    axios({
      method: 'post',
      url: `${API_ROOT}/graph/sendmails`,
      data: {
        authToken: msAuthToken,
      },
    }).then((res) => {
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
