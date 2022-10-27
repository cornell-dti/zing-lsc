import React from 'react'
import {
  Button,
  Box,
  TextField,
  InputLabel,
  Typography,
  Link,
} from '@mui/material'
import { LoginCheckProps } from 'Survey/Types'
import { useAuthValue } from '@auth'
import { signInWithGoogle } from '@fire/firebase'
import { logOut } from '@fire'

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
          lg: '25%',
        },
      }}
    >
      <Typography
        sx={{
          color: '#3d2d49',
          fontSize: '2rem',
          fontWeight: '500',
          mb: '2rem',
        }}
      >
        Confirm Login
      </Typography>
      <img
        src={user?.photoURL ?? ''}
        alt="Profile"
        style={{ borderRadius: '50%', width: 188, marginBottom: '2rem' }}
      />
      <Typography
        sx={{
          color: '#3d2d49',
          fontSize: '1.2rem',
          fontWeight: '500',
          mb: '2rem',
        }}
      >
        Welcome, <b>{user?.displayName}</b>
      </Typography>

      <Box sx={{ textAlign: 'left', mb: '2rem' }}>
        <InputLabel>
          <Typography fontWeight="430">You are signed in as</Typography>
        </InputLabel>
        <TextField
          sx={textInputStyle}
          disabled={true}
          type="email"
          placeholder={user?.email ?? 'No Email Provided'}
        />
      </Box>

      <Button
        color="primary"
        variant="outlined"
        sx={{
          width: '8em',
          fontSize: '16px',
          mb: '3%',
        }}
        disabled={!user}
        onClick={gotoNextStep}
      >
        Continue
      </Button>
      <Link
        onClick={() => {
          logOut()
          signInWithGoogle().catch(() => {})
        }}
        sx={{ color: 'black', textDecoration: 'none', fontWeight: '500' }}
      >
        Not You?
      </Link>
    </Box>
  )
}
