import styled from 'styled-components'

import bg from '@assets/img/homebg.svg'
import bg2 from '@assets/img/blobhomebg2.svg'

export const StyledContainer1 = styled.main`
  background-image: url(${bg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  // blob overlay
  &:before {
    content: '';
    background: url(${bg2}) no-repeat bottom;
    background-size: 100% auto;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    object-fit: contain;
  }
`
export const StyledContainer2 = styled.main`
  height: 100%;
  background-image: url(${bg2});
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledLabelText = styled.text`
  padding-left: 0.5rem;
  font-weight: 700;
  position: relative;
`
