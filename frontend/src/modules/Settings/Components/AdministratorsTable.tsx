import { useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { DeleteOutline, Undo } from '@mui/icons-material'
import { colors } from '@core'
import { Box, Button } from '@mui/material'
import { AllowedUsers, Admin } from './types'

const StyledTableCell = styled(TableCell)(() => ({
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

export const AdministratorsTable = ({ data, removeAdmin }: AllowedUsers) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isDeletingRow, setIsDeletingRow] = useState<Admin>()

  const confirmDelete = async (row: Admin) => {
    if (isDeleting && row === isDeletingRow) {
      removeAdmin(row)
      setIsDeleting(false)
    } else {
      setIsDeleting(true)
      setIsDeletingRow(row)
    }
  }

  const undoDelete = () => {
    setIsDeleting(false)
    setIsDeletingRow(undefined)
  }

  return (
    <Box
      sx={{
        m: 'auto',
        pt: 1,
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
              <StyledTableCell> Name </StyledTableCell>
              <StyledTableCell> Email </StyledTableCell>
              <StyledTableCell sx={{ width: 150 }}> </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <StyledTableRow key={row.email}>
                <StyledTableCell>
                  {row.name ? row.name : 'Administrator Name'}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.email}
                </StyledTableCell>
                {isDeleting && row === isDeletingRow ? (
                  <StyledTableCell>
                    <Button
                      onClick={() => confirmDelete(row)}
                      sx={{ right: 20 }}
                    >
                      Delete
                    </Button>
                    <Undo
                      onClick={() => undoDelete()}
                      sx={{
                        '&:hover': { scale: '1.2', cursor: 'pointer' },
                      }}
                    />
                  </StyledTableCell>
                ) : (
                  <StyledTableCell
                    sx={{
                      width: 150,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <DeleteOutline
                      color={'action'}
                      onClick={() => {
                        confirmDelete(row)
                      }}
                      sx={{
                        '&:hover': { scale: '1.2', cursor: 'pointer' },
                      }}
                    />
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
