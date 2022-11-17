import React from 'react'
import {
  Button,
  Box,
  TextField,
  InputLabel,
  Typography,
  Link,
  Avatar,
} from '@mui/material'
import { LoginCheckProps } from 'Survey/Types'
import { useAuthValue } from '@auth'
import { signInWithGoogle } from '@fire/firebase'

export const LoginCheck = ({ gotoNextStep }: LoginCheckProps) => {
  const textInputStyle = {
    input: {
      color: 'black',
      fontSize: '16px',
      fontWeight: '500',
      width: '16rem',
    },
  }

  const { user } = useAuthValue()
  const userEmail = user?.providerData[0].email
  const validEmail = /^\w+@cornell.edu$/
  const isValidEmail = validEmail.test(userEmail ?? '')

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: '#fff',
        boxShadow:
          '-10px -10px 150px rgba(0, 0, 0, 0.1), 10px 10px 150px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexFlow: 'column nowrap',
        width: {
          xs: '100%',
          lg: '40%',
        },
        height: {
          xs: '100%',
          lg: '80%',
        },
        margin: {
          xs: '0%',
          lg: '28%',
        },
      }}
    >
      <Typography
        sx={{
          color: '#3d2d49',
          fontSize: '2rem',
          fontWeight: '500',
          mb: '6%',
        }}
      >
        Confirm Login
      </Typography>
      <Avatar
        src={user?.photoURL ?? ''}
        alt="profile"
        imgProps={{ referrerPolicy: 'no-referrer' }}
        sx={{ marginBottom: '1.2rem', height: '10rem', width: '10rem' }}
      />
      <Typography
        sx={{
          color: '#3d2d49',
          fontSize: '1.2rem',
          fontWeight: '500',
          mb: '6%',
        }}
      >
        Welcome, <b>{user?.displayName}</b>
      </Typography>

      <Box sx={{ textAlign: 'left', mb: '2rem' }}>
        <InputLabel>
          <Typography fontWeight="400" color="black">
            You are signed in as
          </Typography>
        </InputLabel>
        <TextField
          sx={textInputStyle}
          type="email"
          value={userEmail ?? 'No Email Provided'}
          helperText={!isValidEmail && 'Error: Not a valid cornell.edu email'}
          error={!isValidEmail}
          disabled
        />
      </Box>

      <Button
        color="primary"
        variant="outlined"
        sx={{
          width: '8em',
          fontSize: '16px',
          mb: '8%',
        }}
        disabled={!isValidEmail || !user}
        onClick={gotoNextStep}
      >
        Continue
      </Button>
      <Link
        onClick={() => {
          console.log(user)
          signInWithGoogle().catch(() => {})
        }}
        sx={{
          color: 'black',
          fontSize: '14px',
          textDecoration: 'none',
          fontWeight: '500',
        }}
      >
        Not You?
      </Link>
    </Box>
  )
}
