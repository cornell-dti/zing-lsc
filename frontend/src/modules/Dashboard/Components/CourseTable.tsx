import React from 'react'
import Table from '@mui/material/Table'
import {
  StyledTextBox,
  StyledSmallText,
  StyledClassesContainer,
  StyledNoClasses,
} from 'Dashboard/Styles/Groups.style'
import {
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
import { colors, EDIT_ZING_PATH } from '@core'
import { defaultSortingOrder, defaultFilterOption } from './Dashboard'
import { Box, Typography } from '@mui/material'
import { ReactComponent as NewlyMatchableIcon } from '@assets/img/newlymatchable.svg'
import { ReactComponent as GroupsIcon } from '@assets/img/groupsicon.svg'
import { ReactComponent as PlusIcon } from '@assets/img/plusicon.svg'
import { ReactComponent as WarningIcon } from '@assets/img/warning.svg'

export const CourseTable = ({ courses }: CourseGridProps) => {
  const history = useHistory()
  // returns color of background, button, and if newly matchable
  function getColor(students: number, groups: number) {
    //all students are matched
    if (students === 0 && groups > 0) {
      return { color: colors.white, new_match: 'no' }
    }
    //students are ready to be matched
    else if (students > 0 && groups > 0) {
      return { color: colors.lightgreen, new_match: 'no' }
    }
    //NEWLY MATCHABLE
    else if (students > 1 && groups === 0) {
      return { color: colors.lightgreen, new_match: 'yes' }
    }
    //only 1 student & 0 groups formed
    else return { color: colors.yellow, new_match: 'no' }
  }

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
            px: 10,
            py: 4,
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ background: '#EDEDEE' }}>
                <TableRow>
                  <TableCell>Course </TableCell>
                  <TableCell align="left">Students</TableCell>
                  <TableCell align="left">Groups</TableCell>
                  <TableCell align="left">Recent Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.courseId}>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Link
                          sx={{
                            color: 'black',
                            fontWeight: 'bold',
                            textDecorationColor: 'black',
                          }}
                          component="button"
                          variant="body1"
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
                        {getColor(c.unmatched.length, c.lastGroupNumber)
                          .new_match === 'yes' && <NewlyMatchableIcon />}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          background: getColor(
                            c.unmatched.length,
                            c.lastGroupNumber
                          ).color,
                        }}
                      >
                        {c.unmatched.length === 1 ? (
                          <WarningIcon />
                        ) : (
                          <PlusIcon />
                        )}
                        <Typography>
                          {c.unmatched.length}{' '}
                          {c.unmatched.length === 1
                            ? 'New Student'
                            : 'New Students'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <GroupsIcon />
                        <Typography>
                          {c.lastGroupNumber}{' '}
                          {c.lastGroupNumber === 1
                            ? 'Group Formed'
                            : 'Groups Formed'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {c.latestSubmissionTime.getMonth() + 1}
                        {'/'}
                        {c.latestSubmissionTime.getDate()}
                        {'/'}
                        {c.latestSubmissionTime.getFullYear()}
                      </Typography>
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
