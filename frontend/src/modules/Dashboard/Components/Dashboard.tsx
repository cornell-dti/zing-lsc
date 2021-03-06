import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { ReactComponent as LogoImg } from '@assets/img/lscicon.svg'
import {
  StyledContainer,
  StyledHeaderMenu,
} from 'Dashboard/Styles/Dashboard.style'
import { Groups } from 'Dashboard/Components/Groups'
import { CourseInfo } from 'Dashboard/Types/CourseInfo'
import { API_ROOT, COURSE_API } from '@core/Constants'
import { KeyboardArrowDown } from '@mui/icons-material'
import { logOut } from '@fire'
import { useAuthValue } from '@auth'
import { Box, CircularProgress, SelectChangeEvent } from '@mui/material'
import { DropdownSelect } from '@core/Components'

type SortOrder =
  | 'newest-requests-first'
  | 'unmatchable-first'
  | 'newly-matchable-first'
  | 'matchable-first'
  | 'classes-a-z'
  | 'classes-z-a'

export const Dashboard = () => {
  const [sortedOrder, setSortedOrder] = useState<SortOrder>(
    'newest-requests-first'
  )
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [courses, setCourses] = useState<CourseInfo[]>([])
  const [hasLoadedCourseData, setHasLoadedCourseData] = useState(false)

  const { user, displayNetworkError } = useAuthValue()

  useEffect(() => {
    axios.get(`${API_ROOT}${COURSE_API}`).then(
      (res) => {
        setCourses(
          res.data.data.map((course: any) => ({
            ...course,
            latestSubmissionTime: new Date(course.latestSubmissionTime),
          }))
        )
        setHasLoadedCourseData(true)
      },
      (error) => displayNetworkError(error.message)
    )
    return () => {
      setAnchorEl(null) // clean state for anchorEl on unmount
    }
  }, [displayNetworkError])

  // (a,b) = -1 if a before b, 1 if a after b, 0 if equal
  function sorted(courseInfo: CourseInfo[], menuValue: SortOrder) {
    switch (menuValue) {
      case 'newest-requests-first':
        return [...courseInfo].sort(
          (a, b) =>
            b.latestSubmissionTime.valueOf() - a.latestSubmissionTime.valueOf()
        )
      case 'unmatchable-first':
        return [...courseInfo].sort((a, _) => {
          //-1 if a unmatchable and b isn't
          if (a.lastGroupNumber === 0 && a.unmatched.length === 1) {
            return -1
          } else return 1
        })
      case 'newly-matchable-first':
        return [...courseInfo].sort((a, _) => {
          //-1 if a newly matchable and b isn't
          if (a.lastGroupNumber === 0 && a.unmatched.length > 1) {
            return -1
          } else return 1
        })
      case 'matchable-first':
        return [...courseInfo].sort((a, _) => {
          //-1 if a matchable and b isn't
          if (
            (a.lastGroupNumber > 0 && a.unmatched.length > 0) ||
            (a.lastGroupNumber === 0 && a.unmatched.length > 1)
          ) {
            return -1
          } else return 1
        })
      case 'classes-a-z':
        return [...courseInfo].sort((a, b) => {
          return a.names[0].localeCompare(b.names[0], undefined, {
            numeric: true,
          })
        })
      case 'classes-z-a':
        return [...courseInfo].sort((a, b) => {
          return b.names[0].localeCompare(a.names[0], undefined, {
            numeric: true,
          })
        })
      default:
        return courseInfo
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSortedOrder(event.target.value as SortOrder)
  }

  const sortedCourses = sorted(courses, sortedOrder)

  return (
    <StyledContainer>
      <StyledHeaderMenu>
        <LogoImg />
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box
            sx={{
              fontWeight: 'bold',
              color: 'essentials.75',
              padding: 1,
              margin: 1,
            }}
          >
            Sort by:
          </Box>
          <DropdownSelect
            value={sortedOrder}
            onChange={handleChange}
            sx={{
              padding: 0,
              margin: 0,
              fontWeight: 'bold',
            }}
          >
            <MenuItem value="newest-requests-first">
              Newest requests first
            </MenuItem>
            <MenuItem value="unmatchable-first">Unmatchable first</MenuItem>
            <MenuItem value="newly-matchable-first">
              Newly matchable first
            </MenuItem>
            <MenuItem value="matchable-first">Matchable first</MenuItem>
            <MenuItem value="classes-a-z">Classes A-Z</MenuItem>
            <MenuItem value="classes-z-a">Classes Z-A</MenuItem>
          </DropdownSelect>
        </Box>
        <Button
          id="logout-button"
          aria-controls="logout-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDown />}
          variant="text"
          disableRipple
        >
          {user?.displayName}
        </Button>
        <Menu
          id="logout-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'logout-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose()
              logOut()
            }}
          >
            Log Out
          </MenuItem>
        </Menu>
      </StyledHeaderMenu>
      {hasLoadedCourseData ? (
        <Groups groups={sortedCourses} />
      ) : (
        <Box display="flex" justifyContent="center" padding={4}>
          <CircularProgress size={50} />
        </Box>
      )}
    </StyledContainer>
  )
}
