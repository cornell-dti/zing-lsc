import styled from 'styled-components'
import addbutton from '@assets/img/addbutton.svg'
import { GenericHTMLProps, h2, StyledComponent } from '@core'

const AddButton = ({
  className,
  onClick,
}: StyledComponent & GenericHTMLProps) => (
  <div className={className} onClick={onClick}>
    <img src={addbutton} alt="addbutton" />
  </div>
)

export const StyledContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`

export const StyledTitle = styled.div`
  ${h2};
`

export const StyledGroupArea = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const StyledGroupCardArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

export const StyledAddButton = styled(AddButton)`
  cursor: pointer;
  margin: 2rem;
`

export const StyledText = styled.div`
  ${h2};
  font-weight: 300;
  margin-top: 1rem;
`
