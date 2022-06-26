import styled, { css } from 'styled-components'

import { colors, h1, h2, h3, StyledComponent } from '@core'

import teamPic from '@assets/img/teamwork.svg'

export { StyledContainer } from 'Survey/Styles/StepTemplate.style'

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
  background: #815ed4;
  @media (max-width: 900px) {
    display: none;
  }
`

export const StyledWhiteActionText = styled.h1`
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
    padding: 5% 5%;
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
  width: 100;
`

export const StyledHeaderText = styled.text`
  ${h1};
  color: ${colors.black};
  @media (max-width: 900px) {
    font-size: 4rem;
    margin-bottom: 10px;
  }
`

export const StyledWelcomeText = styled.text`
  ${h2};
  font-weight: 300;
  color: ${colors.black};
  @media (max-width: 900px) {
    font-size: 2rem;
  }
`

export const StyledTextFieldWrapper = styled.div``
