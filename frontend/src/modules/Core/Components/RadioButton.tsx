import React from 'react'

import { RadioButtonProps } from '@core/Types/FormFieldProps'
import { StyledLabel, StyledContainer } from '@core/Styles/RadioButton.style'
import Radio, { RadioProps } from '@mui/material/Radio'
import { colors } from '@core'
import styled from '@mui/styled-engine'

const PurpleRadio = styled((props: RadioProps) => (
  <Radio color="default" {...props} />
))`
  &.MuiCheckbox-root {
    color: ${colors.darkpurple};
  }

  .Mui-checked {
    color: ${colors.darkpurple};
  }
`

export const RadioButton = ({
  currentAnswer,
  onClick,
  label,
  value,
}: RadioButtonProps) => {
  // potentially change this kind of styling later?
  const containerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '0.5rem',
    minWidth: '35rem',
    maxWidth: '60rem',
    background: '#FFFFFF',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: '11px',
    marginBottom: '1rem',
  }

  return (
    <StyledLabel>
      <StyledContainer style={containerStyle}>
        <PurpleRadio
          checked={value === currentAnswer}
          onChange={onClick}
          value={value}
          name="radio-button-mui"
          inputProps={{ 'aria-label': value }}
        />
        <div>{label}</div>
      </StyledContainer>
    </StyledLabel>
  )
}
