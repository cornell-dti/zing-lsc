import React from 'react'
import {
  IconButton,
  Box,
  TextField,
  InputLabel,
  FormHelperText,
  Typography,
} from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import {
  StyledContainer,
  StyledLeftPanel,
  StyledRightPanel,
  StyledFields,
  StyledWhiteActionText,
  StyledTeamPic,
  StyledTitleWrapper,
  StyledHeaderText,
  StyledWelcomeText,
  StyledErrorText,
} from 'Survey/Styles/StepBegin.style'
import { StyledLabelText } from 'Survey/Styles/Survey.style'
import { StepBeginProps } from 'Survey/Types'

export const StepBegin = ({
  name,
  email,
  setName,
  setEmail,
  gotoNextStep,
}: StepBeginProps) => {
  const textInputStyle = {
    marginBottom: '1rem',
    input: { color: 'purple.120', fontSize: '24px', fontWeight: '500' },
    '& .MuiInput-underline:before': { borderBottomColor: 'purple.75' },
  }

  const [isValidEmail, setIsValidEmail] = React.useState(true)
  const validEmail = /^\w+@cornell.edu$/

  return (
    <StyledContainer>
      <StyledLeftPanel>
        <StyledWhiteActionText>
          Cornell’s Learning Strategies Center can help match Cornell students
          with study partners!
        </StyledWhiteActionText>
        <StyledTeamPic />
      </StyledLeftPanel>
      <StyledRightPanel>
        <StyledTitleWrapper>
          <StyledHeaderText>Hi,</StyledHeaderText>
          <StyledWelcomeText>Find study partners!</StyledWelcomeText>
        </StyledTitleWrapper>

        <StyledFields>
          <InputLabel id="Name:" htmlFor="user name">
            <StyledLabelText> Name: </StyledLabelText>
          </InputLabel>
          <TextField
            id="user name"
            variant="standard"
            aria-labelledby="Name:"
            placeholder="Student Name"
            sx={textInputStyle}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <InputLabel id="Email:" htmlFor="user email">
            <StyledLabelText> Email: </StyledLabelText>
          </InputLabel>
          <TextField
            id="user email"
            variant="standard"
            aria-labelledby="Email:"
            value={email}
            sx={textInputStyle}
            type="email"
            onBlur={() => setIsValidEmail(validEmail.test(email))}
            placeholder="abc123@cornell.edu"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            error={!isValidEmail}
          />
          <FormHelperText id="email-helper-text">
            <StyledErrorText>
              {isValidEmail ? ' ' : 'Invalid Email'}
            </StyledErrorText>
          </FormHelperText>
        </StyledFields>
        <Box
          sx={{
            marginLeft: 'auto',
            textAlign: 'center',
            color: 'purple.100',
            weight: 600,
          }}
        >
          <IconButton
            className="next"
            onClick={gotoNextStep}
            disabled={name === '' || email === '' || !isValidEmail}
            sx={{ boxShadow: 3 }}
            aria-labelledby="Next"
          >
            <ArrowForward />
          </IconButton>
          <Typography id="Next"> Next </Typography>
        </Box>
      </StyledRightPanel>
    </StyledContainer>
  )
}
