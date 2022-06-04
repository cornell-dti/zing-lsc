import React from 'react'

import { RadioButton } from '@core'
import { RadioButtonsProps } from '@core/Types'

import { StyledContainer } from '@core/Styles/RadioButtons.style'

export const RadioButtons = ({
  values,
  onClick,
  currentAnswer,
}: RadioButtonsProps) => {
  return (
    <StyledContainer>
      {values.map((value, i) => (
        <RadioButton
          key={i}
          currentAnswer={currentAnswer}
          onClick={onClick}
          value={value}
          label={value}
          name="RadioButtons"
          checked={value === currentAnswer}
        />
      ))}
    </StyledContainer>
  )
}
