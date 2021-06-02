import styled, { css } from 'styled-components'

import { colors, h1, h2, h3, StyledComponent } from '@core'

import bg from '@assets/img/bg1.svg'
import logo from '@assets/img/whitelogo.svg'
import teacher from '@assets/img/teacher.svg'

const Logo = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={logo} alt="logo" />
  </div>
)
export const StyledLogo = styled(Logo)`
  margin: 2.5rem;
`

const TeacherPic = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={teacher} alt="teacher" width="100%" />
  </div>
)
export const StyledTeacherPic = styled(TeacherPic)`
  max-width: 100%;
  margin-top: 8rem;
`

export const StyledBackground = styled.div`
  background-image: url(${bg});
  background-size: cover;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledContainer = styled.div`
  height: 86.5%;
  width: 80%;
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
  background: linear-gradient(
    162.9deg,
    #c794ee 0.78%,
    #d9b6f6 27.99%,
    #e8d6fb 55.75%,
    #f6f3ff 101.78%
  );
`

export const StyledWhiteActionText = styled.text`
  ${h3};
  color: ${colors.white};
  text-align: center;
`

export const StyledRightPanel = styled.div`
  ${halfPanel};
  box-sizing: border-box;
  padding: 0 6rem;
  gap: 6rem;
`

export const StyledTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledHeaderText = styled.text`
  ${h1};
  color: ${colors.black};
`

export const StyledWelcomeText = styled.text`
  ${h2};
  font-weight: 400;
  color: ${colors.black};
`

export const StyledButtonsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 12rem;
`
