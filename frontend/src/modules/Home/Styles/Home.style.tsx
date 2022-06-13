import styled, { css } from 'styled-components'

import { colors, device, h1, h2, h3 } from '@core'

import bg from '@assets/img/landingbg.svg'
import bg2 from '@assets/img/blobhomebg2.svg'
import { Typography } from '@mui/material'

const panel = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const halfPanel = css`
  ${panel};
  height: 100%;
  width: 50%;
`

export const StyledBackground = styled.div`
  background-image: url(${bg});
  background-position: top left;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: none;
  display: flex;
`

export const StyledLeftPanel = styled.div`
  ${halfPanel};
  align-items: left;
  margin-left: 5rem;
`

export const StyledWhiteActionText = styled(Typography)`
  ${h3};
  margin-bottom: 3rem;
  color: ${colors.white};
  text-align: left;
  z-index: 1;
`

export const StyledRightPanel = styled.div`
  ${halfPanel};
  box-sizing: border-box;
  padding-top: 5rem;
  box-shadow: -10px -10px 150px rgba(0, 0, 0, 0.1),
    10px 10px 150px rgba(0, 0, 0, 0.1);
`

export const StyledHeaderText = styled(Typography)`
  ${h1};
  color: #3d2d49;
  z-index: 1;
`

export const StyledWelcomeText = styled(Typography)`
  ${h2};
  font-weight: 400;
  color: #3d2d49;
  z-index: 1;
`
