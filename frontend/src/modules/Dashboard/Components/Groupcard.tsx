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
  StyledClock,
  StyledManIcon,
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
  deadline,
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
          <StyledManIcon />
          <StyledText>{submitted} Forms Submitted</StyledText>
        </StyledRow>
        <StyledRow>
          <StyledClock />
          {/* <StyledText>{moment(deadline).format('Do MMM YYYY')}</StyledText> */}
        </StyledRow>
      </StyledRows>
      <StyledButtons>
        <Button
          containerStyle={{
            background: new Date() > deadline ? colors.white : colors.purple,
            border:
              new Date() > deadline ? `1px solid ${colors.purple}` : '0px',
            width: '45%',
            borderRadius: '40px',
          }}
          labelStyle={{
            color: new Date() > deadline ? colors.purple : colors.white,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
          }}
          onClick={() => {
            const index = window.location.href.indexOf('/dashboard')
            const baseUrl = window.location.href.slice(0, index)
            navigator.clipboard.writeText(`${baseUrl}${SURVEY_PATH}?id=${id}`)
            setOpen(true)
          }}
          label={'Copy link'}
        />
        {new Date() > deadline && (
          <Button
            containerStyle={{
              background: colors.purple,
              width: '45%',
              borderRadius: '40px',
            }}
            labelStyle={{
              color: colors.white,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            }}
            onClick={() => {
              history.push(`/editZing/?id=${'z98mmggpO05931CviaUy'}`) // TODO: @shichong replace with real docID
            }}
            label={'Match'}
          />
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
  submitted: number
  total: number
  deadline: Date
}
