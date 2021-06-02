import React, { useState } from 'react'

import { RadioButton } from '@core'
import { RadioButtonsProps } from '@core/Types'

import { StyledContainer } from '@core/Styles/RadioButtons.style'

export const RadioButtons = ({
  values,
  onClick,
  key,
  currentAnswer,
}: RadioButtonsProps) => {
  const [clickedIndex, setClickedIndex] = useState(-1)
  let radioButtonList: JSX.Element[] = []

  values.forEach((value: string, index: number) => {
    // index not zero because we do not want the question
    if (index !== 0) {
      radioButtonList.push(
        <RadioButton
          currentAnswer={currentAnswer}
          onClick={onClick}
          setClickedIndex={(index: number) => setClickedIndex(index)}
          index={index}
          value={String(index)}
          label={value}
          name="RadioButtons"
          key={key}
          checked={index === clickedIndex}
        />
      )
    }
  })
  return <StyledContainer>{radioButtonList}</StyledContainer>
}
