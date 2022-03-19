import styled, { css } from 'styled-components'

import { colors, device, h1, h2, h3, StyledComponent } from '@core'

import bg from '@assets/img/homebg.svg'
import bg2 from '@assets/img/blobhomebg2.svg'
import teacher from '@assets/img/teacher.svg'
import { Typography } from '@mui/material'

const TeacherPic = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={teacher} alt="teacher" width="100%" />
  </div>
)

export const StyledTeacherPic = styled(TeacherPic)`
  max-width: 100%;
  margin-top: 4rem;
`

export const StyledBackground = styled.div`
  background-image: url(${bg});
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  // blob overlay
  &:before {
    content: '';
    background: url(${bg2});
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 0;
  }
`

export const StyledContainer = styled.div`
  height: 86.5%;
  width: 80%;
  // make this more proportional with larger screens
  @media screen and ${device.laptopL} {
    height: 680px;
    width: 1200px;
  }
  background-color: ${colors.white};
  box-shadow: -10px -10px 150px rgba(0, 0, 0, 0.1),
    10px 10px 150px rgba(0, 0, 0, 0.1);
  display: flex;
`

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

export const StyledLeftPanel = styled.div`
  ${halfPanel};
  align-items: center;
  background: radial-gradient(
    112.68% 110.04% at -4.77% -2.25%,
    #795cd2 21.53%,
    #8d6ad9 54.63%,
    #795cd2 99.43%
  );
`

export const StyledWhiteActionText = styled(Typography)`
  ${h3};
  color: ${colors.white};
  text-align: center;
  z-index: 1;
`

export const StyledRightPanel = styled.div`
  ${halfPanel};
  box-sizing: border-box;
  padding: 0 6rem;
  gap: 3rem;
`

export const StyledTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -6rem;
  z-index: 1;
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
