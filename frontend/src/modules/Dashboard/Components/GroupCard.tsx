import React from 'react'
import { useHistory } from 'react-router-dom'
// import moment from 'moment'
import Snackbar, { SnackbarCloseReason } from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

import {
  StyledContainer,
  StyledName,
  StyledRows,
  StyledRow,
  StyledText,
  StyledButtons,
} from 'Dashboard/Styles/GroupCard.style'
import { Button, colors, SURVEY_PATH } from '@core'

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const GroupCard = ({
  key,
  id,
  name,
  submitted,
  total,
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

  return (
    <StyledContainer key={key}>
      <StyledName>{name}</StyledName>
      <StyledRows>
        <StyledRow>
          <StyledText>{submitted} Forms Submitted</StyledText>
        </StyledRow>
        <StyledRow></StyledRow>
      </StyledRows>
      <StyledButtons>
        <Button
          containerStyle={{
            background: colors.darkpurple,
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
  submitted: number
  total: number
}
