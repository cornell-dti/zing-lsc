import React from 'react'

import styled, { css } from 'styled-components'
import { colors, h2, h4, StyledComponent } from '@core'
import { Question } from '../Components/Question'

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
