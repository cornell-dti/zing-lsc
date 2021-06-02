import React from 'react'
import { colors, h1, h2, h3, h4, StyledComponent } from '@core'
import styled from 'styled-components'

export const StyledContainer = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`

export const StyledGroupTextWrapper = styled.div`
  margin-bottom: 1rem;
`

export const StyledGroupText = styled.text`
  ${h3};
  font-weight: 700;
  color: ${colors.black};
`
export const StyledStudentName = styled.text`
  ${h4};
  font-weight: 700;
  color: ${colors.black};
`
