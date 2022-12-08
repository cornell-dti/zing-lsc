import { Box, Typography } from '@mui/material'

export const StatCard = ({
  number,
  title,
  subtitle,
  thisWeek,
  showAdded,
}: StatCardProps) => {
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
      {showAdded && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2px 10px',
              gap: '10px',
              objectFit: 'contain',
              background: '#D0EAD6',
              borderRadius: ' 8px',
            }}
          >
            {' '}
            <Typography variant="h6" color="#157E2C" fontWeight={600}>
              + {thisWeek}
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            color="#898992"
            fontWeight={600}
            sx={{ marginLeft: '10px' }}
          >
            this week
          </Typography>
        </Box>
      )}
      <Typography variant="h2" fontWeight={600}>
        {number}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} color="#898992">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}
interface StatCardProps {
  number: number
  title: string
  subtitle: string
  thisWeek: number
  showAdded: boolean
}
