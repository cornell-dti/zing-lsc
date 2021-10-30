import styled from 'styled-components'
import manicon from '@assets/img/manicon.png'
import { FiClock } from 'react-icons/fi'
import { colors, h3, h4, StyledComponent } from '@core'

const ManIcon = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={manicon} alt="manicon" />
  </div>
)

export const StyledContainer = styled.div`
  height: 300px;
  width: 320px;
  background: ${colors.paleviolet};
  border-radius: 30px;
  margin: 2rem;
  padding: 3rem 1.5rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

export const StyledName = styled.div`
  ${h3};
  font-weight: 600;
`

export const StyledRows = styled.div``

export const StyledRow = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
`

export const StyledManIcon = styled(ManIcon)`
  margin-right: 0.5rem;
`

export const StyledClock = styled(FiClock)`
  margin-right: 0.5rem;
`

export const StyledText = styled.text`
  ${h4}
`
export const StyledButtons = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-around;
`
