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
import { Box, CircularProgress } from '@mui/material'

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

  const [courses, setCourses] = useState<CourseInfo[]>([])
  const [hasLoadedCourseData, setHasLoadedCourseData] = useState(false)

  const { user } = useAuthValue()

  useEffect(() => {
    axios.get(`${API_ROOT}${COURSE_API}`).then((res) => {
      setCourses(res.data.data)
      setHasLoadedCourseData(true)
    })
    return () => {
      setAnchorEl(null) // clean state for anchorEl on unmount
    }
  }, [])

  return (
    <StyledContainer>
      <StyledHeaderMenu>
        <LogoImg />
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
              handleClose()
              logOut().then(() => {
                history.push('/')
              })
            }}
          >
            Log Out
          </MenuItem>
        </Menu>
      </StyledHeaderMenu>
      {hasLoadedCourseData ? (
        <Groups groups={courses} />
      ) : (
        <Box display="flex" justifyContent="center" padding={4}>
          <CircularProgress size={50} />
        </Box>
      )}
    </StyledContainer>
  )
}
