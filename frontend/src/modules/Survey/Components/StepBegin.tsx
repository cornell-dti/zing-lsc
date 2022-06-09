import React from 'react'
import { IconButton, Box } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { TextField } from '@mui/material'
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
          <TextField
            placeholder="Name"
            variant="standard"
            sx={textInputStyle}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <TextField
            value={email}
            sx={textInputStyle}
            variant="standard"
            type="email"
            onBlur={() => setIsValidEmail(validEmail.test(email))}
            placeholder="Cornell Email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            error={!isValidEmail}
            helperText={isValidEmail ? ' ' : 'Invalid Email'}
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
            className="next"
            onClick={gotoNextStep}
            disabled={name === '' || email === '' || !isValidEmail}
            sx={{ boxShadow: 3 }}
          >
            <ArrowForward />
          </IconButton>
          <br />
          Next
        </Box>
      </StyledRightPanel>
    </StyledContainer>
  )
}
