import React from 'react'

import { RadioButtonProps } from '@core/Types/FormFieldProps'
import { StyledLabel, StyledContainer } from '@core/Styles/RadioButton.style'
import Radio, { RadioProps } from '@material-ui/core/Radio'
import { colors } from '@core'
import { withStyles } from '@material-ui/core/styles'

const PurpleRadio = withStyles({
  root: {
    color: colors.darkpurple,
    '&$checked': {
      color: colors.darkpurple,
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />)

export const RadioButton = ({
  currentAnswer,
  onClick,
  setClickedIndex,
  index,
  label,
  value,
}: RadioButtonProps) => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '0 1rem',

    background: '#FFFFFF',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: '11px',
    marginBottom: '1rem',
  }
  /**
   * Function called when radio button is clicked on
   */
  function handleOnClick(e: React.ChangeEvent<HTMLInputElement>) {
    onClick(e)
    setClickedIndex(index)
  }

  return (
    <StyledLabel>
      <StyledContainer style={containerStyle}>
        <PurpleRadio
          checked={value === currentAnswer}
          onChange={handleOnClick}
          value={value}
          name="radio-button-mui"
          inputProps={{ 'aria-label': value }}
        />
        <div>{label}</div>
      </StyledContainer>
    </StyledLabel>
  )
}
