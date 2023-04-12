import { useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { DeleteOutline, Edit } from '@mui/icons-material'
import { colors } from '@core'
import { Box } from '@mui/material'
import { API_ROOT } from '@core'
import axios from 'axios'
import { AllowedUsers, Admin } from './types'

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

export const AdministratorsTable = ({ data }: AllowedUsers) => {
  const removeAdmin = (admin: Admin) => {
    axios
      .delete(`${API_ROOT}/admin`, { data: admin })
      .then(() => {
        data.forEach((email, index) => {
          if ((email.email = admin.email)) {
            data.splice(index, 1)
          }
        })
      })
      .catch((err) => console.log(err))
  }

  // TODO: allow to edit admin information
  const editAdmin = () => {}

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
                <StyledTableCell>Administrator Name</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.email}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    width: 150,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <DeleteOutline
                    color="action"
                    onClick={() => {
                      removeAdmin(row)
                    }}
                    sx={{
                      '&:hover': { scale: '1.2', cursor: 'pointer' },
                    }}
                  ></DeleteOutline>
                  <Edit
                    color="action"
                    onClick={editAdmin}
                    sx={{
                      '&:hover': { scale: '1.2', cursor: 'pointer' },
                    }}
                  ></Edit>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
