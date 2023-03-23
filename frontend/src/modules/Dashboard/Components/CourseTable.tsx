import React from 'react'
import Table from '@mui/material/Table'
import {
  StyledTextBox,
  StyledSmallText,
  StyledClassesContainer,
  StyledNoClasses,
} from 'Dashboard/Styles/Groups.style'

import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Course } from '@core/Types'
import { useHistory } from 'react-router-dom'
import Link from '@mui/material/Link'
import { EDIT_ZING_PATH } from '@core/Constants'
import { defaultSortingOrder, defaultFilterOption } from './Dashboard'

export const CourseTable = ({ courses }: CourseGridProps) => {
  const history = useHistory()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      {courses.length === 0 ? (
        <>
          <StyledTextBox>
            <h2>No Courses to Show</h2>
          </StyledTextBox>
          <StyledSmallText>
            Once students request study partners, they'll automatically be
            placed into courses on this page!
          </StyledSmallText>
          <StyledClassesContainer>
            {[...Array(8)].map((_, i) => (
              <StyledNoClasses key={i} />
            ))}
          </StyledClassesContainer>
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            justifyContent: 'center',
            gap: 4,
            gridTemplateColumns: 'repeat(auto-fill, 300px)',
            px: 10,
            py: 4,
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Course </TableCell>
                  <TableCell align="right">New Students</TableCell>
                  <TableCell align="right">Groups</TableCell>
                  <TableCell align="right">Date In Question</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.courseId}>
                    <TableCell>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                          const state = history.location.state as any
                          history.push({
                            pathname: `${EDIT_ZING_PATH}/${c.courseId}`,
                            state: {
                              sortedOrder: state?.sortedOrder
                                ? state.sortedOrder
                                : defaultSortingOrder,
                              filterOption: state?.filterOption
                                ? state.filterOption
                                : defaultFilterOption,
                            },
                          })
                        }}
                      >
                        {c.names[0]}
                      </Link>
                    </TableCell>
                    <TableCell align="right">{c.unmatched.length}</TableCell>
                    <TableCell align="right">
                      {c.lastGroupNumber} Groups Formed
                    </TableCell>
                    <TableCell align="right">
                      {c.latestSubmissionTime.toDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  )
}

interface CourseGridProps {
  courses: Course[]
}
