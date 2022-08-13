import { StyledBackground } from 'Home/Styles/Home.style'
import { adminSignIn } from '@fire'
import { Box, Button, Typography } from '@mui/material'
import matchimg from '@assets/img/matching.svg'

export const AdminHome = () => {
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
            md: '50%',
          },
          alignItems: 'left',
          margin: '0 3rem',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight={'500'}
          sx={{
            color: 'white',
            width: '100%',
            fontFamily: 'palatino-roman',
          }}
        >
          <em>The</em> Learning Strategies Center
        </Typography>
        <Typography
          variant="h2"
          fontWeight={'600'}
          sx={{ mb: '3rem', color: 'white', fontSize: '3.25rem' }}
        >
          Connect students. <br />
          Create groups.
        </Typography>
        <Button
          color="secondary"
          variant="outlined"
          sx={{
            width: '14em',
            fontSize: '22px',
            mb: '1.25em',
          }}
          onClick={() => {
            adminSignIn().catch(() => {})
          }}
        >
          LSC Admin Login
        </Button>
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
          width: '50%',
          alignItems: 'left',
          marginLeft: '5rem',
        }}
      >
        <Box
          sx={{
            mt: '12rem',
          }}
        >
          <img src={matchimg} alt="matching" width="65%" />
        </Box>
      </Box>
    </StyledBackground>
  )
}
