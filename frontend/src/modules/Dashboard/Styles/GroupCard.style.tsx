import styled from 'styled-components'
import { FiClock } from 'react-icons/fi'
import { ReactComponent as GroupsIcon } from '@assets/img/groupsicon.svg'
import { ReactComponent as PlusIcon } from '@assets/img/plusicon.svg'
import { ReactComponent as NewlyMatchable } from '@assets/img/newlymatchable.svg'
import { h3, h4, ColorProps } from '@core'

export const StyledGroupsIcon = styled(GroupsIcon)`
  padding-right: 1rem;
`

export const StyledPlusIcon = styled(PlusIcon)`
  padding-right: 1rem;
`
export const StyledNewlyMatchable = styled(NewlyMatchable)``

export const StyledContainer = styled.div<Pick<ColorProps, 'color'>>`
  height: 300px;
  width: 320px;
  background: ${(p) => p.color};
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
  padding: 3px;
  display: flex;
  align-items: center;
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
// interface ColorProps {
//   color: string
// }
