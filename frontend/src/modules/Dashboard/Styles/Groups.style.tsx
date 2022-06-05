import styled from 'styled-components'
import { ReactComponent as NoClassesIcon } from '@assets/img/noclassesicon.svg'
import { h2, h3, h4 } from '@core'

export const StyledNoClasses = styled(NoClassesIcon)`
  position: static;
  width: 375px;
  height: 380px;
  left: 0px;
  top: 0px;
  padding: 0px;
  margin: -20px;
`

export const StyledTitle = styled.div`
  ${h2};
`

export const StyledText = styled.div`
  ${h2};
  font-weight: 300;
  margin-top: 1rem;
`

export const StyledTextBox = styled.div`
  ${h4};
  text-align: center;
`

export const StyledSmallText = styled.div`
  ${h3};
  font-size: 1.3rem !important;
  width: 50%;
  height: 30%;
  word-wrap: break-word;
  margin: auto;
  text-align: center;
`
export const StyledClassesContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 5.5rem;
  flex-direction: row;
  flex-wrap: wrap;
`
