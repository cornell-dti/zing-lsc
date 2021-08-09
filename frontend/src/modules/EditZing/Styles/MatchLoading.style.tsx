import { colors, body } from '@core/Constants'
import styled from 'styled-components'

export const StyledLoadingContainer = styled.div`
  height: 450px;
  width: 600px;
  border-radius: 10px;
  background-color: ${colors.white};
`

export const StyledLoadingText = styled.p`
  ${body};
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;
  margin: 3rem 2rem;
`

export const StyledProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8rem;
`
