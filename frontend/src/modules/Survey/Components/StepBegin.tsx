import React from 'react'
import {
  IconButton,
  Box,
  TextField,
  InputLabel,
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
} from 'Survey/Styles/StepBegin.style'
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

  const helperTextStyle = {
    style: {
      color: '#d41e42',
      fontSize: '1rem',
      fontWeight: 600,
    },
  }

  const [isValidEmail, setIsValidEmail] = React.useState(true)
  const validEmail = /^\w+@cornell.edu$/

  return (
    <StyledContainer>
      <StyledLeftPanel>
        <StyledWhiteActionText>
          LSC can help match you with study partners for your classes!
        </StyledWhiteActionText>
        <StyledTeamPic />
      </StyledLeftPanel>
      <StyledRightPanel>
        <StyledTitleWrapper>
          <StyledHeaderText>Hi,</StyledHeaderText>
          <StyledWelcomeText>Find study partners!</StyledWelcomeText>
        </StyledTitleWrapper>

        <StyledFields>
          <InputLabel htmlFor="name">
            <Typography fontWeight="medium">Name:</Typography>
          </InputLabel>
          <TextField
            id="name"
            variant="standard"
            placeholder="Student Name"
            sx={textInputStyle}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <InputLabel htmlFor="email">
            <Typography fontWeight="medium">Email:</Typography>
          </InputLabel>
          <TextField
            id="email"
            variant="standard"
            value={email}
            sx={textInputStyle}
            type="email"
            onBlur={() => setIsValidEmail(validEmail.test(email))}
            placeholder="abc123@cornell.edu"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            error={!isValidEmail}
            helperText={!isValidEmail && 'Invalid Email'}
            FormHelperTextProps={helperTextStyle}
          />
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
            onClick={gotoNextStep}
            disabled={name === '' || email === '' || !isValidEmail}
            sx={{ boxShadow: 3 }}
            aria-labelledby="next"
          >
            <ArrowForward />
          </IconButton>
          <Typography id="next">Next</Typography>
        </Box>
      </StyledRightPanel>
    </StyledContainer>
  )
}
