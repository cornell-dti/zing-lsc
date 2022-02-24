import { LinearProgress, linearProgressClasses, styled } from '@mui/material'
import { ProgressBarProps } from '@core'

function toVal(step: number, total: number) {
  return (step / total) * 100
}

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'step' && prop !== 'total',
})<{ step: number; total: number }>(({ theme, step, total }) => ({
  height: 16,
  position: 'relative',
  [`&.${linearProgressClasses.root}`]: {
    backgroundColor: theme.palette.essentials['12'],
  },
  [`& .${linearProgressClasses.bar}`]: {
    background: 'linear-gradient(296.38deg, #6D52AF 5.53%, #D9CFF2 96.38%)',
    '&::after': {
      content: `'${
        Math.floor(step) === step ? step : step.toFixed(1)
      }/${total}'`,
      position: 'absolute',
      color: 'white',
      right: 5,
      fontFamily: 'Montserrat',
      fontSize: 12,
    },
  },
}))

export const ProgressBar = ({
  value = 0,
  step = value,
  total = 100,
  sx,
}: ProgressBarProps) => {
  return (
    <BorderLinearProgress
      variant="determinate"
      value={step && total ? toVal(step, total) : value}
      step={step}
      total={total}
      sx={sx}
    />
  )
}
