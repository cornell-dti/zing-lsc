import styled from 'styled-components'
import { h2, h4 } from '@core'

export const StyledContainer = styled.main`
  margin: auto;
`

export const StyledQuestionText = styled.h1`
  ${h2};
  font-weight: 500;
  line-height: 10px;
  text-align: center;
  margin-bottom: 50px;
`

export const StyledWarningText = styled.div`
  ${h4};
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  margin: 0px 20%;
  margin-bottom: 50px;
`
export const StyledCoursesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`
