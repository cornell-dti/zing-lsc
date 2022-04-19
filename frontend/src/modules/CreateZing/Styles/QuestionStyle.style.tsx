import styled from 'styled-components'
import { h4 } from '@core'

export const StyledText = styled.text`
  ${h4};
  font-weight: 500;
  line-height: 10px;
  padding-bottom: 0.5rem;
`

export const StyledQuestionContainer = styled.div`
  display: flex;
  width: inherit;
  flex-direction: column;
  box-sizing: border-box;
  margin: 1rem;
  position: relative;
`
