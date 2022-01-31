import { LinearProgress, linearProgressClasses, styled } from '@mui/material'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 16,
  position: 'relative',
  [`&.${linearProgressClasses.root}`]: {
    backgroundColor: theme.palette.essentials['12'],
  },
  [`& .${linearProgressClasses.bar}`]: {
    background: 'linear-gradient(296.38deg, #6D52AF 5.53%, #D9CFF2 96.38%)',
    '&::after': {
      content: "'4/8'",
      position: 'absolute',
      color: 'white',
      right: 5,
      fontFamily: 'Montserrat',
      fontSize: 12,
    },
  },
}))

const ProgressBar = () => {
  return <BorderLinearProgress variant="determinate" value={50} />
}

export default ProgressBar
