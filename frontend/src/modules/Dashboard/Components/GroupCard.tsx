import React from 'react'
import { useHistory } from 'react-router-dom'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { colors } from '@core'
import {
  StyledContainer,
  StyledName,
  StyledRows,
  StyledRow,
  StyledText,
  StyledButtons,
  StyledGroupsIcon,
  StyledPlusIcon,
  StyledWarningIcon,
  StyledNewlyMatchable,
} from 'Dashboard/Styles/GroupCard.style'
import { Button, TextField, Typography } from '@mui/material'
import { Label } from '@mui/icons-material'

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const GroupCard = ({
  key,
  name,
  newStudents,
  groupsFormed,
}: GroupCardProps) => {
  // const history = useHistory()
  const [open, setOpen] = React.useState(false)

  const handleClose = (
    // fixed type of event
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }
  // returns color of background, button, and if newly matchable
  function getColor(students: number, groups: number) {
    //all students are matched
    if (students === 0 && groups > 0) {
      return [colors.paleviolet, colors.darkpurple, 'no']
    }
    //students are ready to be matched
    else if (newStudents > 0 && groupsFormed > 0) {
      return [colors.lightgreen, colors.darkgreen, 'no']
    }
    //NEWLY MATCHABLE
    else if (newStudents > 1 && groupsFormed === 0) {
      return [colors.lightgreen, colors.darkgreen, 'yes']
    }
    //only 1 student & 0 groups formed
    else return [colors.yellow, colors.yellow, 'no']
  }
  const styleArray = getColor(newStudents, groupsFormed)

  return (
    <StyledContainer key={key}>
      <StyledRows>
        {styleArray[2] === 'yes' && <StyledNewlyMatchable />}
      </StyledRows>
      <StyledRows>
        <StyledName>{name}</StyledName>
      </StyledRows>
      <StyledRows>
        <StyledRow>
          {newStudents === 1 && (
            <Typography
              sx={{
                background: styleArray[0],
                fontSize: 18,
                width: 1,
              }}
            >
              <StyledWarningIcon></StyledWarningIcon>
              {newStudents} New Student
            </Typography>
          )}
          {newStudents != 1 && (
            <Typography
              sx={{
                background: styleArray[0],
                fontSize: 18,
                width: 1,
              }}
            >
              <StyledPlusIcon></StyledPlusIcon>
              {newStudents} New Students
            </Typography>
          )}
        </StyledRow>
        <StyledRow>
          <StyledGroupsIcon></StyledGroupsIcon>
          {groupsFormed === 1 && (
            <Typography
              sx={{
                fontSize: 18,
              }}
            >
              {groupsFormed} Group Formed
            </Typography>
          )}
          {groupsFormed != 1 && (
            <Typography
              sx={{
                fontSize: 18,
              }}
            >
              {groupsFormed} Groups Formed
            </Typography>
          )}
        </StyledRow>
        <StyledRow />
      </StyledRows>
      <StyledButtons>
        <Button
          sx={{
            width: 1 / 3,
            padding: 1,
            boxShadow: 2,
            justifyContent: '',
          }}
          color="secondary"
          variant="outlined"
        >
          View
        </Button>
        {newStudents > 1 && (
          <Button
            sx={{
              width: 1 / 3,
              padding: 1,
              ml: -6,
              boxShadow: 2,
            }}
          >
            Match
          </Button>
        )}
      </StyledButtons>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success">
          Link for {name} copied to clipboard!
        </Alert>
      </Snackbar>
    </StyledContainer>
  )
}

interface GroupCardProps {
  key: number
  id: string
  name: string
  newStudents: number
  groupsFormed: number
}
