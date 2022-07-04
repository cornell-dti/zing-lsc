import styled from 'styled-components'

import { colors } from '@core'

export const StyledContainer = styled.main`
  height: 86.5%;
  width: 80%;
  background-color: ${colors.white};
  box-shadow: -10px -10px 150px rgba(0, 0, 0, 0.1),
    10px 10px 150px rgba(0, 0, 0, 0.1);
  display: flex;
  @media (max-width: 900px) {
    width: 100%;
    height: 100%;
  }
`

export const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  padding: 0 5%;

  @media (min-width: 901px) {
    overflow-y: scroll;
    height: 80%;
  }
`
