import styled from 'styled-components'
import { h2 } from '@core'

export const StyledContainer = styled.div`
  margin: auto;
`

export const StyledRadioButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.25rem;
  justify-content: center;
  align-items: center;
`

export const StyledQuestionText = styled.h1`
  ${h2};
  font-weight: 500;
  line-height: 10px;
  text-align: center;
  margin-bottom: 2.5rem;
`

export const StyledFieldSet = styled.fieldset`
  border-style: none;
  border-color: #ffffff;
`
