import styled from 'styled-components'
import { h2, h4 } from '@core'

export const StyledContainer = styled.div`
  margin: auto;
`

export const StyledQuestionText = styled.div`
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
  margin: 0px 250px;
  margin-bottom: 50px;
`
export const StyledCoursesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`
