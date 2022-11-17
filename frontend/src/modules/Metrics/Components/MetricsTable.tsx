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

function createData(
  college: string,
  students: number,
  requests: number,
  matches: number,
  groups: number
) {
  return { college, students, requests, matches, groups }
}

const rows = [
  createData('College of Arts and Sciences', 159, 6.0, 24, 4.0),
  createData('College of Engineering', 237, 9.0, 37, 4.3),
  createData('College of Human Ecology', 262, 16.0, 24, 6.0),
  createData('College of Industrial and Labor Relations', 305, 3.7, 67, 4.3),
]

export const MetricsTable = () => {
  return (
    <Box
      sx={{
        m: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>College </StyledTableCell>
              <StyledTableCell align="right">Students</StyledTableCell>
              <StyledTableCell align="right">Requests</StyledTableCell>
              <StyledTableCell align="right">Matches</StyledTableCell>
              <StyledTableCell align="right">Groups</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.college}>
                <StyledTableCell component="th" scope="row">
                  {row.college}
                </StyledTableCell>
                <StyledTableCell align="right">{row.students}</StyledTableCell>
                <StyledTableCell align="right">{row.requests}</StyledTableCell>
                <StyledTableCell align="right">{row.matches}</StyledTableCell>
                <StyledTableCell align="right">{row.groups}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
