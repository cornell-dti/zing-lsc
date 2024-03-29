import { StyledBackground } from 'Home/Styles/Home.style'
import { adminSignIn } from '@fire'
import { Box, Typography } from '@mui/material'
import matchimg from '@assets/img/matching.svg'

import { ReactComponent as CornellSeal } from '@assets/img/CornellSealWhite.svg'
import { LoadingButton } from '@mui/lab'
import React from 'react'

export const AdminHome = () => {
  const [isLoading, setLoading] = React.useState(false)
  function handleSigninClick() {
    setLoading(true)
  }
  return (
    <StyledBackground>
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'center',
          height: '100%',
          width: {
            xs: '100%',
            md: '70%',
          },
          alignItems: 'left',
          padding: '0 0 0 4rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row nowrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '73px',
            }}
          >
            <CornellSeal />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            fontWeight={'500'}
            sx={{
              color: 'white',
              width: '100%',
            }}
          >
            Cornell Learning Strategies Center
          </Typography>
        </Box>
        <Typography
          variant="h2"
          fontWeight={'600'}
          sx={{ mb: '3rem', color: 'white', fontSize: '2.75rem' }}
        >
          Connect students. <br />
          Create groups.
        </Typography>
        <LoadingButton
          loading={isLoading}
          color={isLoading ? undefined : 'secondary'}
          variant="outlined"
          sx={{
            backgroundColor: 'white',
            width: '14em',
            fontSize: '22px',
            mb: '1.25em',
          }}
          onClick={() => {
            handleSigninClick()
            adminSignIn().catch(() => {
              setLoading(false)
            })
          }}
        >
          LSC Admin Login
        </LoadingButton>
      </Box>
      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'flex',
          },
          flexFlow: 'column nowrap',
          justifyContent: 'center',
          height: '100%',
          width: '30%',
          alignItems: 'left',
        }}
      >
        <Box sx={{ mt: '12rem' }}>
          <img src={matchimg} alt="matching" width="90%" />
        </Box>
      </Box>
    </StyledBackground>
  )
}
