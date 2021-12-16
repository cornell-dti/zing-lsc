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
  StyledName,
  StyledArrowDown,
} from 'Dashboard/Styles/Dashboard.style'
import { Groups } from 'Dashboard/Components/Groups'
import { CourseInfo } from 'Dashboard/Types/CourseInfo'
import { API_ROOT, COURSE_API } from '@core/Constants'

// commented this out because it's not used for now
// if you choose to use this, it will not work because makeStyles will have been removed. Use the styled API in MUI 5 now.

// const useStyles = makeStyles((theme) => ({
//   modal: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// }))

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
      // console.log(res.data)
      setGroups(res.data.data)
    })
  }, [])

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
    </StyledOuterContainer>
  )
}
