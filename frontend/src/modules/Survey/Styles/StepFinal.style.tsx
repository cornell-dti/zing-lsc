import styled, { css } from 'styled-components'

import { h2, h3, StyledComponent } from '@core'
import { StyledContainer as Container } from 'Survey/Styles/StepTemplate.style'
import { SuccessIcon } from 'Survey/Types'

import logo from '@assets/img/smallwhitelogo.svg'

const Logo = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={logo} alt="logo" />
  </div>
)

const Check = ({ className, src }: SuccessIcon) => (
  <div className={className}>
    <img src={src} alt="check" />
  </div>
)

export const StyledLogoWrapper = styled.div`
  display: flex;
  margin-top: 10%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const StyledLogo = styled(Logo)`
  margin-top: 8.4%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const StyledCheck = styled(Check)`
  margin-right: 6%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const StyledContainer = styled(Container)`
  background: #815ed4;
  display: flex;
  flex-flow: row wrap;
`

const panel = css`
  display: flex;
  flex-direction: column;
`

const fullPanel = css`
  ${panel};
  height: 100%;
  width: 100%;
`

export const StyledFullPanel = styled.div`
  ${fullPanel}
`

export const StyledCongratulationsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  align-items: center;
  width: 80%;
  margin-top: 10%;
`
export const StyledCongratulationsText = styled.h1`
  ${h2};
  font-weight: 500;
  color: white;
  width: 73%;
  @media (max-width: 900px) {
    width: 100%;
  }
`
export const StyledContactWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
  margin: 10% 5%;
`

export const StyledContactText = styled.text`
  ${h3};
  font-weight: 400;
  color: #ffffff;
`
