import styled from 'styled-components'
import { h2 } from '@core'

export const StyledContainer = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 100%;
  padding: 50px 0;
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
  line-height: 1.2ch;
  text-align: center;
  margin-bottom: 2.5rem;
`

export const StyledFieldSet = styled.fieldset`
  border-style: none;
  border-color: #ffffff;
  width: 100%;
`
