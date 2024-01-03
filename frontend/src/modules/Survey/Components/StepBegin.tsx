import React from 'react'
import {
  IconButton,
  Box,
  TextField,
  InputLabel,
  Typography,
} from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { StyledTeamPic } from 'Survey/Styles/StepBegin.style'
import { StepBeginProps } from 'Survey/Types'

export const StepBegin = ({
  name,
  email,
  setName,
  setEmail,
  gotoNextStep,
}: StepBeginProps) => {
  const textInputStyle = {
    marginBottom: '1rem',
    input: { color: 'purple.120', fontSize: '24px', fontWeight: '500' },
    '& .MuiInput-underline:before': { borderBottomColor: 'purple.75' },
  }

  const helperTextStyle = {
    style: {
      color: '#d41e42',
      fontSize: '1rem',
      fontWeight: 600,
    },
  }

  const [isValidEmail, setIsValidEmail] = React.useState(true)
  const validEmail = /^\w+@cornell\.edu$/

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: '#fff',
        boxShadow:
          '-10px -10px 150px rgba(0, 0, 0, 0.1), 10px 10px 150px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        width: {
          xs: '100%',
          lg: '80%',
        },
        height: {
          xs: '100%',
          lg: '86.5%',
        },
      }}
    >
      <Box
        sx={{
          display: {
            xs: 'none',
            lg: 'flex',
          },
          width: '50%',
          flexFlow: 'column nowrap',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#815ed4',
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: '700',
            fontSize: '1.75rem',
            color: '#fff',
            margin: ' 0 3rem',
          }}
        >
          Cornell's Learning Strategies Center can help match Cornell students
          with study partners!
        </Typography>
        <StyledTeamPic />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: {
            xs: '100%',
            lg: '50%',
          },
          flexFlow: 'column nowrap',
          padding: '36px 3rem',
          justifyContent: 'center',
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#3d2d49',
              fontSize: '4.5rem',
              fontWeight: '500',
            }}
          >
            Hi,
          </Typography>
          <Typography
            sx={{
              color: '#3d2d49',
              fontSize: '2.25rem',
              fontWeight: '400',
            }}
          >
            Find study partners!
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            justifyContent: 'center',
            margin: '4rem 0',
          }}
        >
          <InputLabel htmlFor="name">
            <Typography fontWeight="medium">Name:</Typography>
          </InputLabel>
          <TextField
            id="name"
            variant="standard"
            placeholder="Full Name"
            sx={textInputStyle}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <InputLabel htmlFor="email">
            <Typography fontWeight="medium">Email:</Typography>
          </InputLabel>
          <TextField
            id="email"
            variant="standard"
            value={email}
            sx={textInputStyle}
            type="email"
            onBlur={() => setIsValidEmail(validEmail.test(email))}
            placeholder="abc123@cornell.edu"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            error={!isValidEmail}
            helperText={!isValidEmail && 'Invalid Email'}
            FormHelperTextProps={helperTextStyle}
          />
        </Box>
        <Box
          sx={{
            marginLeft: 'auto',
            textAlign: 'center',
            color: 'purple.100',
            weight: 600,
          }}
        >
          <IconButton
            onClick={gotoNextStep}
            disabled={name === '' || email === '' || !isValidEmail}
            sx={{ boxShadow: 3 }}
            aria-labelledby="next"
          >
            <ArrowForward />
          </IconButton>
          <Typography id="next">Next</Typography>
        </Box>
      </Box>
    </Box>
  )
}
