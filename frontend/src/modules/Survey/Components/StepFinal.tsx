import { StyledCheck } from 'Survey/Styles/StepFinal.style'

import { Box, Typography } from '@mui/material'
import { StepFinalProps } from 'Survey/Types'
import { Button } from '@mui/material'
import check from '@assets/img/whitecheckmark.svg'
import warn from '@assets/img/warnbutton.svg'
import xmark from '@assets/img/xbutton.svg'

export const StepFinal = ({
  success,
  submissionResponse,
  errorMsg,
}: StepFinalProps) => {
  const showWarning = success && submissionResponse.failed.length !== 0
  const buttonStyle = {
    minWidth: '14em',
    fontSize: { sm: 14, md: 22 },
    mt: '1.25em',
    p: '0.24em 1em',
    boxShadow: 1,
  }

  const Success = () => {
    return (
      <>
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', md: '2.25rem' },
            fontWeight: '700',
            color: '#fff',
          }}
        >
          Congrats on completing the form!
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontSize: '1.15rem',
          }}
        >
          You will receive an email in the next few days with more information
          about next steps.
          <br />
          <strong>Courses added: </strong>
          {submissionResponse.added.join(', ') || `None`}
        </Typography>
      </>
    )
  }

  const Warning = () => {
    return (
      <>
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', md: '2.25rem' },
            fontWeight: '700',
            color: '#fff',
          }}
        >
          Some course(s) could not be found in roster{' '}
          {submissionResponse.roster}.
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontSize: '1.15rem',
          }}
        >
          Please double-check that they were spelled correctly, and resubmit the
          form if needed.
          <br />
          <strong> Courses added successfully: </strong>
          {submissionResponse.added.join(', ') || 'None'}
          <br />
          <strong>Courses not added: </strong>
          {submissionResponse.failed.join(', ')}
        </Typography>
      </>
    )
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
          Something went wrong.
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontSize: '1.15rem',
          }}
        >
          {' '}
          Error: {errorMsg}
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
        <StyledCheck src={showWarning ? warn : success ? check : xmark} />
        <Box
          sx={{
            maxWidth: '698px',
          }}
        >
          {showWarning && <Warning />}
          {success && !showWarning && <Success />}
          {!success && <Error />}
        </Box>
      </Box>

      {!showWarning && success ? (
        <Button
          color="secondary"
          variant="outlined"
          href="https://lsc.cornell.edu/"
          sx={{ ...buttonStyle, mt: '4rem' }}
        >
          Back to Learning Strategies Center
        </Button>
      ) : (
        <>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={buttonStyle}
          >
            Return to survey
          </Button>
          <Button
            color="primary"
            variant="outlined"
            href="https://lsc.cornell.edu/"
            sx={buttonStyle}
          >
            Back to Learning Strategies Center
          </Button>
        </>
      )}

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
