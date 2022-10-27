import React from 'react'
import { Button, Box, TextField, InputLabel, Typography } from '@mui/material'
import { LoginCheckProps } from 'Survey/Types'
import { CenterFocusStrong } from '@mui/icons-material'
import { useAuthValue } from '@auth'

export const LoginCheck = ({ gotoNextStep }: LoginCheckProps) => {
  const textInputStyle = {
    input: {
      color: 'purple.120',
      fontSize: '16px',
      fontWeight: '500',
      width: '16rem',
    },
  }

  const helperTextStyle = {
    style: {
      color: '#d41e42',
      fontSize: '1rem',
      fontWeight: 600,
    },
  }

  const { user } = useAuthValue()

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
          lg: '86.5%',
        },
        margin: {
          xs: '0%',
          lg: '25%',
        },
      }}
    >
      <Typography
        sx={{
          color: '#3d2d49',
          fontSize: '2rem',
          fontWeight: '500',
        }}
      >
        Confirm Login
      </Typography>
      <Typography
        sx={{
          color: '#3d2d49',
          fontSize: '1.2rem',
          fontWeight: '500',
        }}
      >
        Welcome, <b>{user?.displayName}</b>
      </Typography>

      <InputLabel>
        <Typography fontWeight="medium">You are signed in as</Typography>
      </InputLabel>
      <TextField
        sx={textInputStyle}
        variant="filled"
        disabled={true}
        type="email"
        placeholder={user?.email ?? 'No Email Provided'}
      />
      <Button
        color="primary"
        variant="outlined"
        sx={{
          width: '8em',
          fontSize: '20px',
        }}
        onClick={gotoNextStep}
      >
        Continue
      </Button>
    </Box>
  )
}
