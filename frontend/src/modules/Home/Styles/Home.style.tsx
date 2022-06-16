import styled, { css } from 'styled-components'
import bg from '@assets/img/landingbg.svg'

const panel = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 50%;
`

export const StyledBackground = styled.body`
  background-image: url(${bg});
  background-position: top left;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledLeftPanel = styled.div`
  ${panel};
  align-items: left;
  margin-left: 5rem;
`

export const StyledRightPanel = styled.div`
  ${panel};
`
