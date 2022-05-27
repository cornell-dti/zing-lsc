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
  }

  function handleNext() {
    gotoNextStep()
  }

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
            placeholder="First Name"
            variant="standard"
            sx={textInputStyle}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            // TODO: add extra thing in conditional so that when they type something that is valid, the error goes away
          />
          <TextField
            placeholder="Last Name"
            value={name}
            sx={textInputStyle}
            variant="standard"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            // TODO: add extra thing in conditional so that when they type something that is valid, the error goes away
          />
          <TextField
            value={email}
            sx={textInputStyle}
            variant="standard"
            placeholder="Cornell NetID"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </StyledFields>
        <Box sx={{ marginLeft: 'auto', textAlign: 'center' }}>
          <IconButton
            className="next"
            onClick={handleNext}
            disabled={name === '' || email === ''}
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
