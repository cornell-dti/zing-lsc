import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  StyledOuterContainer,
  StyledContainer,
  StyledHeaderMenu,
  StyledLogo,
} from 'Dashboard/Styles/Dashboard.style'
import { Groups } from 'Dashboard/Components/Groups'
import { CourseInfo } from 'Dashboard/Types/CourseInfo'
import { API_ROOT, COURSE_API } from '@core/Constants'
import { KeyboardArrowDown } from '@mui/icons-material'
import { logOut } from '../../../firebase/firebase'
import { useHistory } from 'react-router'
import { useAuthValue } from '../../../auth/AuthContext'

export const Dashboard = () => {
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

  const user = useAuthValue()

  useEffect(() => {
    axios.get(`${API_ROOT}${COURSE_API}`).then((res) => {
      setGroups(res.data.data)
    })
  }, [])

  return (
    <StyledOuterContainer>
      <StyledContainer>
        <StyledHeaderMenu>
          <StyledLogo />
          <Button
            sx={{
              color: '#000',
            }}
            id="logout-button"
            aria-controls="logout-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            endIcon={<KeyboardArrowDown />}
            variant="text"
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
    </StyledOuterContainer>
  )
}
