import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import {
  StyledOuterContainer,
  StyledContainer,
  StyledHeaderMenu,
  StyledLogo,
  StyledName,
  StyledArrowDown,
} from 'Dashboard/Styles/Dashboard.style'
import { Groups } from 'Dashboard/Components/Groups'
import { CourseInfo } from 'Dashboard/Types/CourseInfo'
import { API_ROOT, COURSE_API } from '@core/Constants'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

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
      console.log(res.data)
      setGroups(res.data.data)
    })
  }, [])

  const MenuItemtheme = createMuiTheme({
    typography: {
      fontSize: 16,
      fontFamily: 'Montserrat',
    },
  })

  return (
    <StyledOuterContainer>
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
            getContentAnchorEl={null}
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
            <ThemeProvider theme={MenuItemtheme}>
              <MenuItem>Log Out</MenuItem>
            </ThemeProvider>
          </Menu>
        </StyledHeaderMenu>

        <Groups groups={groups} />
      </StyledContainer>
    </StyledOuterContainer>
  )
}
