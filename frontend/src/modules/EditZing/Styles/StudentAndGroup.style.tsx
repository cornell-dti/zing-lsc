import { colors, h3 } from '@core'
import styled from 'styled-components'

export const StyledContainer = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`

export const StyledGroupContainer = styled.div`
  padding: 2rem;
  border: 0.5px solid rgba(205, 156, 242, 0.15);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.07);
  border-radius: 20px;
  margin: 0.25rem;
`

export const StyledGroupText = styled.text`
  ${h3};
  font-weight: 800;
  color: ${colors.black};
  margin-right: 1rem;
`

export const StyledUnmatchedContainer = styled.div`
  padding: 2rem;
  border: 0.5px solid rgba(205, 156, 242, 0.15);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.07);
  border-radius: 20px;
  margin: 0.25rem;
  background: ${colors.verylightgreen};
`

export const StyledUnmatchedTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  justify-content: space-between;
`

export const StyledUnmatchedText = styled.text`
  ${h3};
  font-weight: 800;
  color: ${colors.darkgreen};
  margin-right: 1rem;
`

export const StyledStudentDetail = styled.p`
  font-weight: 400;
  margin: 0;
  padding: 0;
`

export const StyledStudentText = styled.p`
  font-weight: 800;
  margin: 0;
  padding: 0;
`
