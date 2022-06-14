import styled, { css } from 'styled-components'

import { colors, h1, h2, h3 } from '@core'

import bg from '@assets/img/landingbg.svg'
import { Typography } from '@mui/material'

const panel = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
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
  ${panel};
  align-items: left;
  margin-left: 5rem;
  width: 50%;
`

export const StyledWhiteActionText = styled(Typography)`
  ${h3};
  margin-bottom: 3rem;
  color: ${colors.white};
  text-align: left;
`

export const StyledRightPanel = styled.div`
  ${panel};
  width: 50%;
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
`
