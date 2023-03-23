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
    boxShadow: 1,
  }

  const Error = () => {
    return (
      <>
        <Typography
          sx={{
            fontSize: { xs: '2rem', md: '2.25rem' },
            fontWeight: '700',
            color: '#fff',
          }}
        >
          The survey is closed
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontSize: '1.15rem',
          }}
        >
          {' '}
          Lookout for when the survey is open next semester!
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
        }}
      >
        <Box
          sx={{
            maxWidth: '698px',
            display: 'flex',
            flexFlow: 'column wrap',
            gap: '48px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {<Error />}
        </Box>
      </Box>

      <Button
        color="primary"
        variant="outlined"
        href="https://lsc.cornell.edu/"
        sx={buttonStyle}
      >
        Back to Learning Strategies Center
      </Button>

      <Typography
        sx={{
          fontWeight: '400',
          color: '#fff',
          fontSize: { xs: '1.15rem', xl: '1.75rem' },
          margin: '4% 0',
          maxWidth: '699px',
        }}
      >
        Contact{' '}
        <a href="mailto:lscstudypartners@cornell.edu">
          lscstudypartners@cornell.edu
        </a>{' '}
        with any questions.
      </Typography>
    </Box>
  )
}
