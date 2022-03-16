import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  StyledContainer,
  StyledHeaderMenu,
  StyledLogo,
  StyledName,
  StyledArrowDown,
  StyledPagination,
} from 'Dashboard/Styles/Dashboard.style'
import { Groups } from 'Dashboard/Components/Groups'
import { CourseInfo } from 'Dashboard/Types/CourseInfo'
import { API_ROOT, COURSE_API } from '@core/Constants'

export const Dashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [groups, setGroups] = useState<CourseInfo[]>([])

  useEffect(() => {
    axios.get(`${API_ROOT}${COURSE_API}`).then((res) => {
      setGroups(res.data.data)
    })
  }, [])

  return (
    <StyledContainer>
      <StyledHeaderMenu>
        <StyledLogo />
        <Button
          id="logout-button"
          aria-controls="logout-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <StyledName>
            User Name
            <StyledArrowDown />
          </StyledName>
        </Button>
        <Menu
          id="logout-menu"
          anchorEl={anchorEl}
          // getContentAnchorEl={null}
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
            sx={{
              fontFamily: 'Montserrat',
              fontSize: 16,
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
