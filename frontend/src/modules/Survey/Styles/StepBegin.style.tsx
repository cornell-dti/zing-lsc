import styled, { css } from 'styled-components'

import { colors, h1, h2, h3, h4, StyledComponent } from '@core'

import teamPic from '@assets/img/teamwork.svg'
import errorIcon from '@assets/img/erroricon.svg'

export { StyledContainer } from 'Survey/Styles/StepTemplate.style'

const ErrorIcon = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={errorIcon} alt="errorIcon" />
  </div>
)

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
  width: 50%;
`

export const StyledLeftPanel = styled.div`
  ${halfPanel};
  align-items: center;
  background: linear-gradient(296.38deg, #6d52af 5.53%, #d9cff2 96.38%);
  @media (max-width: 900px) {
    display: none;
  }
`

export const StyledWhiteActionText = styled.text`
  ${h3};
  color: ${colors.white};
  text-align: center;
  font-weight: 600;
  margin: 0 6rem;
`

export const StyledRightPanel = styled.div`
  ${halfPanel};
  box-sizing: border-box;
  padding: 0 6rem;
  @media (max-width: 900px) {
    width: 100%;
  }
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
  font-weight: 300;
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

export const StyledTextFieldWrapper = styled.div``
