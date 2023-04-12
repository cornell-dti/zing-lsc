import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { colors } from '@core'
import { Box } from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: colors.paleviolet,
    color: 'black',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export const Administrators = ({ data }: MetricsTableProps) => {
  return (
    <Box
      sx={{
        m: 'auto',
        padding: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 1,
      }}
    >
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 700,
          }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ paddingLeft: '5%' }}>
                College{' '}
              </StyledTableCell>
              <StyledTableCell align="center">
                {' '}
                Student Requests
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <StyledTableRow key={row.rowName}>
                <StyledTableCell
                  sx={{ paddingLeft: '5%' }}
                  component="th"
                  scope="row"
                >
                  {row.rowName}
                </StyledTableCell>
                <StyledTableCell align="center">{row.requests}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
export interface RowData {
  rowName: string
  students: number
  requests: number
  matches: number
  groups: number
}
interface MetricsTableProps {
  data: RowData[]
}
