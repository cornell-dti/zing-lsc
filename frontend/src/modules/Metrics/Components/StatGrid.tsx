import { StyledTextBox } from '../Styles/Groups.style'
import { StatCard } from './StatCard'
import { Box } from '@mui/material'
export const StatGrid = ({ stats }: StatGridProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {stats.length === 0 ? (
        <>
          <StyledTextBox>
            <h2>No Stats to Show</h2>
          </StyledTextBox>
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            justifyContent: 'center',
            gap: 2,
            gridTemplateColumns: 'repeat(4, 1fr)',
            px: 10,
            py: 4,
          }}
        >
          {stats.map((s) => (
            <StatCard number={s.number} title={s.title} subtitle={s.subtitle} />
          ))}
        </Box>
      )}
    </Box>
  )
}
interface Stat {
  number: number
  title: string
  subtitle: string
}
interface StatGridProps {
  stats: Stat[]
}
