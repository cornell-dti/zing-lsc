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
import { useHistory } from 'react-router'
import { DropdownSelect } from '@core/Components'
import { SelectChangeEvent, Box } from '@mui/material'

export const Dashboard = () => {
  const [status, setStatus] = useState('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const history = useHistory()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [groups, setGroups] = useState<CourseInfo[]>([])

  const { user } = useAuthValue()

  useEffect(() => {
    axios.get(`${API_ROOT}${COURSE_API}`).then((res) => {
      setGroups(res.data.data)
    })
  }, [])
  // (a,b) = -1 if a before b, 1 if a after b, 0 if equal
  function sorted(groups: CourseInfo[], menuValue: string) {
    switch (menuValue) {
      case 'newly-match-first':
        return [...groups].sort((a, _) => {
          //-1 if a newly matchable and b isn't
          if (a.lastGroupNumber === 0 && a.unmatched.length > 1) {
            return -1
          } else return 1
        })
      case 'unmatch-first':
        return [...groups].sort((a, _) => {
          //-1 if a unmatchable and b isn't
          if (a.lastGroupNumber === 0 && a.unmatched.length === 1) {
            return -1
          } else return 1
        })
      case 'match-first':
        return [...groups].sort((a, _) => {
          //-1 if a matchable and b isn't
          if (
            (a.lastGroupNumber > 0 && a.unmatched.length > 0) ||
            (a.lastGroupNumber === 0 && a.unmatched.length > 1)
          ) {
            return -1
          } else return 1
        })
      case 'classesa-z':
        return [...groups].sort((a, b) => {
          return a.names[0].localeCompare(b.names[0], undefined, {
            numeric: true,
          })
        })
      case 'classesz-a':
        return [...groups].sort((a, b) => {
          return b.names[0].localeCompare(a.names[0], undefined, {
            numeric: true,
          })
        })
      default:
        return groups
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value)
    setGroups(sorted(groups, event.target.value))
  }

  return (
    <StyledContainer>
      <StyledHeaderMenu>
        <LogoImg />
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box
            sx={{ fontWeight: 'bold', color: '#5C5B6A', padding: 1, margin: 1 }}
          >
            Sort by:
          </Box>
          <DropdownSelect
            value={status}
            onChange={handleChange}
            sx={{
              padding: 0,
              margin: 0,
              fontWeight: 'bold',
            }}
          >
            {/* <MenuItem value="newest">Newest</MenuItem> */}
            <MenuItem value="unmatch-first">Unmatchable first</MenuItem>
            <MenuItem value="newly-match-first">Newly matchable first</MenuItem>
            <MenuItem value="match-first">Matchable first</MenuItem>
            <MenuItem value="classesa-z">Classes A-Z</MenuItem>
            <MenuItem value="classesz-a">Classes Z-A</MenuItem>
          </DropdownSelect>
        </Box>
        <Button
          id="logout-button"
          aria-controls="logout-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDown />}
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
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem
            onClick={() => {
              logOut().then(() => {
                history.push('/')
              })
            }}
          >
            Log Out
          </MenuItem>
        </Menu>
      </StyledHeaderMenu>
      <Groups groups={groups} />
    </StyledContainer>
  )
}
