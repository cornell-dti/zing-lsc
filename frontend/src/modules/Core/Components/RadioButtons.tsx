import React from 'react'

import { RadioButton } from '@core'
import { RadioButtonsProps } from '@core/Types'

import { StyledContainer } from '@core/Styles/RadioButtons.style'

export const RadioButtons = ({
  labels = [],
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
          value={labels[i]}
          label={value}
          name="RadioButtons"
          checked={value === currentAnswer}
        />
      ))}
    </StyledContainer>
  )
}
