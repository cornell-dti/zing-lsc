import React, { useEffect, useState, FunctionComponent } from 'react'
import { NameField, NumberField, colors } from '@core'
import styled, { css } from 'styled-components'
import { QuestionProps } from '../Types/QuestionType'
import {
  StyledQuestionContainer,
  StyledText,
} from '../Styles/QuestionStyle.style'

export const Question = ({
  fullWidth,
  error = '',
  question,
  setAnswer,
  value,
  placeholder,
  isNumber,
  inputStyle,
}: QuestionProps) => {
  // useEffect( () =>
  //   if ()
  // )
  function onChangeNumber(e: React.ChangeEvent<HTMLInputElement>) {
    if (Number(e.target.value) < 0) {
      setAnswer('0')
    } else {
      setAnswer(e.target.value)
    }
  }
  if (isNumber)
    return (
      <StyledQuestionContainer>
        <StyledText>{question}</StyledText>
        <NumberField
          error={error}
          containerStyle={{ width: error !== '' ? '45%' : '15%' }}
          inputStyle={inputStyle}
          placeholder={'0'}
          value={value}
          onChange={onChangeNumber}
        />
      </StyledQuestionContainer>
    )
  else {
    return (
      <StyledQuestionContainer>
        <StyledText>{question}</StyledText>
        <NameField
          error={error}
          fullWidth={fullWidth}
          inputStyle={inputStyle}
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAnswer(e.target.value)
          }
        />
      </StyledQuestionContainer>
    )
  }
}
