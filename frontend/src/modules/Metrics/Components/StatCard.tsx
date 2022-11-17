import { Box, Typography } from '@mui/material'

export const StatCard = ({ number, title, subtitle }: StatCardProps) => {
  return (
    <Box
      sx={{
        width: 243,
        height: 251,
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        position: 'relative',
      }}
    >
      <Typography variant="h4" fontWeight={600}>
        {number}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="subtitle1" fontWeight={600} color="#898992">
        {subtitle}
      </Typography>
    </Box>
  )
}
interface StatCardProps {
  number: number
  title: string
  subtitle: string
}
