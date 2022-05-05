import styled from 'styled-components'
import { h2, h3 } from '@core'

export const StyledContainer = styled.div`
  margin: auto;
`

export const StyledQuestionText = styled.div`
  ${h2};
  font-weight: 500;
  line-height: 10px;
  text-align: center;
  margin-bottom: 120px;
`

export const StyledQuestionSubtext = styled.div`
  ${h3};
  text-align: center;
  margin-top: 15px;
  margin-bottom: 0px;
`

export const StyledCoursesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`
