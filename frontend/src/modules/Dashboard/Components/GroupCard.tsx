import React from 'react'
import { useHistory } from 'react-router-dom'
import Snackbar, { SnackbarCloseReason } from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

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
import { Button, colors, SURVEY_PATH } from '@core'

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const GroupCard = ({
  key,
  id,
  name,
  newStudents,
  groupsFormed,
}: GroupCardProps) => {
  const history = useHistory()
  const [open, setOpen] = React.useState(false)

  const handleClose = (
    event: React.SyntheticEvent,
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
  const styleArray = getColor(
    { newStudents }.newStudents,
    { groupsFormed }.groupsFormed
  )
  return (
    <StyledContainer color={styleArray[0]} key={key}>
      {styleArray[2] === 'yes' && <StyledNewlyMatchable />}
      <StyledName>{name}</StyledName>
      <StyledRows>
        <StyledRow>
          <StyledPlusIcon></StyledPlusIcon>
          <StyledText>{newStudents} News Student</StyledText>
        </StyledRow>
        <StyledRow>
          <StyledGroupsIcon></StyledGroupsIcon>
          <StyledText>{groupsFormed} Groups Formed</StyledText>
        </StyledRow>
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
