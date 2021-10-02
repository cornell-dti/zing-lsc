import { StyledComponent } from '@core'
import { colors, body } from '@core/Constants'
import styled from 'styled-components'

import welldone from '@assets/img/welldone.svg'

const WellDoneImg = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={welldone} alt="logo" />
  </div>
)
export const StyledWellDoneImg = styled(WellDoneImg)``

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
  margin-bottom: 7rem;
`

export const StyledWellDoneText = styled.p`
  ${body};
  font-size: 1.4rem;
  font-weight: 500;
  text-align: left;
`

export const StyledCenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2.5rem;
`
