import React from 'react'
import { useHistory } from 'react-router-dom'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

import {
  StyledContainer,
  StyledName,
  StyledRows,
  StyledRow,
  StyledText,
  StyledButtons,
  StyledGroupsIcon,
  StyledPlusIcon,
  StyledNewlyMatchable,
} from 'Dashboard/Styles/GroupCard.style'
import { Button, colors } from '@core'

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
    else return [colors.lightyellow, colors.darkyellow, 'no']
  }
  const styleArray = getColor(newStudents, groupsFormed)

  return (
    <StyledContainer color={styleArray[0]} key={key}>
      {styleArray[2] === 'yes' && <StyledNewlyMatchable />}
      <StyledName>{name}</StyledName>
      <StyledRows>
        <StyledRow>
          <StyledPlusIcon></StyledPlusIcon>
          {newStudents === 1 && (
            <StyledText>{newStudents} New Student</StyledText>
          )}
          {newStudents != 1 && (
            <StyledText>{newStudents} New Students</StyledText>
          )}
        </StyledRow>
        <StyledRow>
          <StyledGroupsIcon></StyledGroupsIcon>
          {groupsFormed === 1 && (
            <StyledText>{groupsFormed} Group Formed</StyledText>
          )}
          {groupsFormed != 1 && (
            <StyledText>{groupsFormed} Groups Formed</StyledText>
          )}
        </StyledRow>
        <StyledRow />
      </StyledRows>
      <StyledButtons>
        <Button
          containerStyle={{
            background: styleArray[1],
            width: '45%',
            borderRadius: '40px',
          }}
          labelStyle={{
            color: colors.white,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
          }}
          onClick={() => {}}
          label={'View'}
        />
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
