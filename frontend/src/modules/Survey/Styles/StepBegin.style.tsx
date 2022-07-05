import styled from 'styled-components'

import { StyledComponent } from '@core'

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
