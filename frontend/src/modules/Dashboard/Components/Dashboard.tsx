import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { ReactComponent as LogoImg } from '@assets/img/lscicon.svg'
import {
  StyledContainer,
  StyledHeaderMenu,
} from 'Dashboard/Styles/Dashboard.style'
import { CourseGrid } from 'Dashboard/Components/CourseGrid'
import { KeyboardArrowDown } from '@mui/icons-material'
import { logOut } from '@fire'
import { useAuthValue } from '@auth'
import { Box, SelectChangeEvent, Popper } from '@mui/material'
import { DropdownSelect } from '@core/Components'
import { useCourseValue } from '@context/CourseContext'
import { Course } from '@core/Types'

type SortOrder =
  | 'newest-requests-first'
  | 'unmatchable-first'
  | 'newly-matchable-first'
  | 'matchable-first'
  | 'classes-a-z'
  | 'classes-z-a'

export const Dashboard = () => {
  const { user } = useAuthValue()
  const { courses } = useCourseValue()

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

  const [rostorAnchorEl, setRosterAnchorEl] = useState<null | HTMLElement>(null)
  const openRoster = Boolean(rostorAnchorEl)
  const handleRosterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRosterAnchorEl(rostorAnchorEl ? null : event.currentTarget)
  }
  const handleRosterClose = () => {
    setRosterAnchorEl(null)
  }

  // (a,b) = -1 if a before b, 1 if a after b, 0 if equal
  function sorted(courseInfo: Course[], menuValue: SortOrder) {
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
          <MenuItem sx={{ width: '100%', padding: '0', margin: '0' }}>
            <Button
              variant="text"
              onClick={handleRosterClick}
              disableRipple
              sx={{
                border: 'none',
                padding: '5px 15px',
                borderRadius: '0',
                background: 'none',
                color: '#000',
                width: '100%',
                fontWeight: '400',
                fontSize: '16px',
              }}
            >
              Change Roster
            </Button>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              logOut()
            }}
          >
            Log Out
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={rostorAnchorEl}
          open={openRoster}
          onClick={handleRosterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
        >
          <Box
            sx={{
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '24px',
            }}
          >
            <MenuItem onClick={handleRosterClose}>Summer 22</MenuItem>
            <MenuItem onClick={handleRosterClose}>Spring 23 </MenuItem>
            <MenuItem onClick={handleRosterClose}>Fall 22</MenuItem>
          </Box>
        </Menu>
      </StyledHeaderMenu>
      <CourseGrid courses={sortedCourses} />
    </StyledContainer>
  )
}
