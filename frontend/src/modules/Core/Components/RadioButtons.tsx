import React from 'react'

import { RadioButton } from '@core'
import { RadioButtonsProps } from '@core/Types'

import { StyledContainer } from '@core/Styles/RadioButtons.style'

export const RadioButtons = ({
  values,
  onClick,
  key,
  currentAnswer,
}: RadioButtonsProps) => {
  return (
    <StyledContainer>
      {values.map((value) => (
        <RadioButton
          currentAnswer={currentAnswer}
          onClick={onClick}
          value={value}
          label={value}
          name="RadioButtons"
          key={key}
          checked={value === currentAnswer}
        />
      ))}
    </StyledContainer>
  )
}
