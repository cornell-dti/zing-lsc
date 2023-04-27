import { StyledCheck } from 'Survey/Styles/StepFinal.style'

import { Box, Typography } from '@mui/material'
import { StepFinalProps } from 'Survey/Types'
import { Button } from '@mui/material'
import check from '@assets/img/whitecheckmark.svg'
import warn from '@assets/img/warnbutton.svg'
import xmark from '@assets/img/xbutton.svg'

export const StepFail = () => {
  const buttonStyle = {
    minWidth: '14em',
    fontSize: { sm: 14, md: 22 },
    mt: '1.25em',
    p: '0.24em 1em',
  }

  const Error = () => {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row nowrap',
            gap: '60px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '6rem', md: '8.5rem' },
              fontWeight: '700',
              color: '#fff',
            }}
          >
            ):
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '3rem', md: '4.25rem' },
              fontWeight: '700',
              color: '#fff',
            }}
          >
            The Survey Is Currently Closed
          </Typography>
        </Box>
        <Typography
          sx={{
            color: '#fff',
            fontSize: '1.15rem',
            fontWeight: '500',
          }}
        >
          We apologize for any inconvenience, but the survey for finding study
          partners is currently closed for this semester. The survey should open
          up again next semester! Please check back then. Thank you for your
          interest!
        </Typography>
        <Typography
          sx={{
            fontWeight: '500',
            color: '#fff',
            fontSize: '1.15rem',
          }}
        >
          Please Contact{' '}
          <a href="mailto:lscstudypartners@cornell.edu">
            lscstudypartners@cornell.edu
          </a>{' '}
          with any questions or any special one-off circumstances.
        </Typography>
      </>
    )
  }

  return (
    <Box
      sx={{
        background: '#815ed4',
        display: 'flex',
        flexFlow: 'column nowrap',
        width: {
          xs: '100vw',
          lg: '80%',
        },
        height: {
          xs: '100%',
          lg: '90%',
        },
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        padding: '5%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'row wrap',
          gap: '48px',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          p: '0 15%',
        }}
      >
        <Box
          sx={{
            maxWidth: '1098px',
            display: 'flex',
            flexFlow: 'column wrap',
            gap: '48px',
            justifyContent: 'center',
            alignItems: 'left',
          }}
        >
          {<Error />}
        </Box>
      </Box>

      <Button color="inherit" href="https://lsc.cornell.edu/" sx={buttonStyle}>
        Back to Learning Strategies Center
      </Button>
    </Box>
  )
}
