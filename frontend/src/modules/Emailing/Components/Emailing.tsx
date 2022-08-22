import React, { useState } from 'react'
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
import { adminSignIn } from '@fire'

// external imports
import { Box, Button, Typography } from '@mui/material'

// 'www.zing.com/email' route
export const Emailing = () => {
  // optional states to keep track of email sent progress.
  // one state should be enough.
  const [emailSent, setEmailSent] = useState(false)
  const [sendError, setSendError] = useState(false)

  // 1. logged in user info
  let auth = getAuth()
  let user = auth.currentUser
  let email = user?.email

  /* TODO: ask @sean ? or future work
        
    1.5 get other info the email needs to send:  
       
    */
  const emailBody = "templates.get('template body')"
  const emailSubject = "templates.get('template subject line')"
  const emailRcpts = [
    'zhanliam21@gmail.com',
    'wz282@cornell.edu',
    'willzhang21@icloud.com',
  ]

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
        emailBody: emailBody,
        emailSubject: emailSubject,
        emailRcpts: emailRcpts,
      },
    }).then((res) => {
      // 4. reading response for success or failure
      console.log(res)
      if (res.data === 'Email send success.') {
        setEmailSent(true)
        setSendError(false)
      } else {
        setEmailSent(false)
        setSendError(true)
        console.log('email send error')
      }
    })
  }

  const Succ = () => {
    return (
      <Box
        display="flex"
        flex-direction="row"
        align-items=" center"
        justifyContent="space-between"
      >
        <Typography>
          {emailSent ? 'Email is sent' : 'Email not yet sent'}!
        </Typography>
      </Box>
    )
  }

  const EmailErr = () => {
    return (
      <Box
        display="flex"
        flex-direction="row"
        align-items=" center"
        justifyContent="space-between"
      >
        <Typography>
          {sendError
            ? 'Email failed to send. Please log back in and reauthenticate to send email.'
            : 'No email send error'}
          !
          {sendError && (
            <Button
              onClick={() => {
                adminSignIn().then(() => sendEmail())
              }}
            >
              Try Again
            </Button>
          )}
        </Typography>
      </Box>
    )
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
          Send Emails
        </Button>
      </Box>
      <Succ />
      <EmailErr />
    </StyledContainer>
  )
}

/** Returns (bool)
    SUCC -> true 
    FAIL -> false  */
export const sendEmail = async (emailItems: any) => {
  let emailSent = false
  // 1. logged in user info
  let auth = getAuth()
  let user = auth.currentUser
  let email = user?.email
  // 2. obtaining auth token from local storage
  const msAuthToken = localStorage.getItem('authToken') || ' '
  const {
    emailSubject,
    indivEmail,
    emailBody,
    courseId,
    groupNum,
    selectedTemplate,
  } = emailItems

  // 3. request to the backend to send mail
  await axios({
    method: 'post',
    url: `${API_ROOT}/email/send`,
    data: {
      emailAddress: email,
      emailBody: emailBody,
      emailSubject: emailSubject,
      indivEmail: indivEmail,
      courseId: courseId,
      group: groupNum,
      template: selectedTemplate,
      authToken: msAuthToken,
    },
  }).then((res) => {
    // 4. reading response for success or failure
    console.log(res)
    if (res.data === 'Email send success') {
      emailSent = true
    } else {
      // handle error
      emailSent = false
      console.log('Email send error. Please try again.')
      console.log(res.data)
      throw new Error(`API call to send email failed.`)
    }
  })

  // bool true if succ false if fail (just a current safeguard return for now, should be handled by a try catch)
  return emailSent
}
