import styled from 'styled-components'
import { colors, h1, h2 } from '@core'
import bg from '@assets/img/bg1.svg'

export const StyledBackground = styled.div`
  background-image: url(${bg});
  background-size: cover;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledContainer = styled.div`
  height: 86.5%;
  width: 80%;
  background-color: ${colors.white};
  box-shadow: -10px -10px 150px rgba(0, 0, 0, 0.1),
    10px 10px 150px rgba(0, 0, 0, 0.1);
`

export const StyledCenter = styled.div`
  height: 100%;
  margin: 0 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 100px;
`

export const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const StyledHeaderText = styled.text`
  ${h1};
  color: ${colors.black};
`

export const StyledWelcomeText = styled.text`
  ${h2};
  font-weight: 300;
  color: ${colors.black};
`

export const StyledFields = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`
