import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import { Modal } from '@material-ui/core'

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
  StyledNoClasses,
  StyledName,
  StyledArrowDown,
  StyledClassesContainer,
  StyledTextBox,
  StyledSmallText,
} from 'Dashboard/Styles/Dashboard.style'
import { Groups } from 'Dashboard/Components/Groups'
import { CourseInfo } from 'Dashboard/Types'
// import { useAppSelector } from '@redux/hooks'
import { API_ROOT, COURSE_API, USER_API } from '@core/Constants'
import { ControlPointDuplicateOutlined } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export const Dashboard = () => {
  const classes = useStyles()
  const [modalOpen, setModalOpen] = useState(false)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const userEmail = 'cornell@cornell.edu'
  // useAppSelector((state) => state.auth.user?.email)
  const [groups, setGroups] = useState<CourseInfo[]>([])

  var showMenu = false
  useEffect(() => {
    axios
      .get(`${API_ROOT}${USER_API}/${userEmail}${COURSE_API}`)
      .then((res) => {
        setGroups(res.data)
      })
  }, [userEmail])

  const MenuItemtheme = createMuiTheme({
    typography: {
      fontSize: 16,
      fontFamily: 'Montserrat',
    },
  })

  const Menutheme = createMuiTheme({})

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
              {/* {useAppSelector((state) => state.auth.user?.displayName)} */}
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
        <StyledTextBox>
          <h2>No Classes to Show</h2>
        </StyledTextBox>
        <StyledSmallText>
          Once students request study partners, they'll automatically be placed
          into classes on this page!
        </StyledSmallText>
        <StyledClassesContainer>
          <StyledNoClasses />
          <StyledNoClasses />
          <StyledNoClasses />
          <StyledNoClasses />
          <StyledNoClasses />
          <StyledNoClasses />
          <StyledNoClasses />
          <StyledNoClasses />
        </StyledClassesContainer>

        {/* <Groups groups={groups} toggleModalOpen={() => setModalOpen(true)} /> */}
      </StyledContainer>
    </StyledOuterContainer>
  )
}
