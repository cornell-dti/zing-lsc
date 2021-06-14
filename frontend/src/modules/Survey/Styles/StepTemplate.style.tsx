import styled, { css } from 'styled-components'

import progress from '@assets/img/progressbarstep1.svg'
import { colors, StyledComponent } from '@core'
import { GoNextPrevButton } from 'Survey/Components/UIElements/GoNextPrevButton'

const ProgressBar = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={progress} alt="progress" />
  </div>
)

const panel = css`
  display: flex;
  flex-direction: column;
`

export const fullPanel = css`
  ${panel};
  height: 100%;
  width: 100%;
`

export const StyledFullPanel = styled.div`
  ${fullPanel}
  box-sizing: border-box;
  padding: 1.5rem;
  position: relative;
`

export const StyledFullPanelNoPadding = styled.div`
  ${fullPanel}
`

export const StyledContainer = styled.div`
  height: 86.5%;
  width: 80%;
  background-color: ${colors.white};
  box-shadow: -10px -10px 150px rgba(0, 0, 0, 0.1),
    10px 10px 150px rgba(0, 0, 0, 0.1);

  display: flex;
`

export const StyledWrapper = styled.div`
  display: flex;
`

export const StyledPrevButton = styled(GoNextPrevButton)`
  cursor: pointer;
`

export const StyledNextButton = styled(GoNextPrevButton)`
  cursor: pointer;
  margin-left: auto;
`

export const StyledProgressBar = styled(ProgressBar)`
  justify-content: left;
  align-content: left;
`
