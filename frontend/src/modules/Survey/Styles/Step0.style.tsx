import styled, { css } from 'styled-components'

import { NameField, EmailField } from '@core'
import { colors, h1, h2, h3, h4, StyledComponent } from '@core'

import logo from '@assets/img/whitelogo.svg'
import teamPic from '@assets/img/teamwork.svg'
import errorIcon from '@assets/img/erroricon.svg'

export { StyledContainer } from 'Survey/Styles/StepTemplate.style'

const ErrorIcon = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={errorIcon} alt="errorIcon" />
  </div>
)

const Logo = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={logo} alt="logo" />
  </div>
)
export const StyledLogo = styled(Logo)`
  margin: 2.5rem;
`

const TeamPic = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={teamPic} alt="teamPic" width="100%" />
  </div>
)
export const StyledTeamPic = styled(TeamPic)`
  max-width: 100%;
  margin-top: 8rem;
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
`

export const StyledFields = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 6rem 0;
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

export const StyledErrorIcon = styled(ErrorIcon)`
  padding-top: 1rem;
`

export const StyledErrorWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

export const StyledErrorText = styled.text`
  ${h4};
  color: ${colors.red};
  padding-left: 0.5rem;
  font-weight: 500;
  position: relative;
`

export const StyledNameField = styled(NameField)`
  display: flex;
`

export const StyledTextFieldWrapper = styled.div``

export const StyledEmailField = styled(EmailField)`
  display: flex;
`
