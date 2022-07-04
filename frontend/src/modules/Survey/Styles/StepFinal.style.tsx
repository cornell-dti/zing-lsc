import styled from 'styled-components'

import { StyledComponent } from '@core'
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
