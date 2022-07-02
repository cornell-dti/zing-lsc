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
  width: 100%;

  @media (min-width: 901px) {
    padding: 1.5rem;
    position: relative;
  }
  background: red;
`

export const StyledFullPanelNoPadding = styled.div`
  ${fullPanel}
`

export const StyledContainer = styled.main`
  height: 86.5%;
  width: 80%;
  background-color: ${colors.white};
  box-shadow: -10px -10px 150px rgba(0, 0, 0, 0.1),
    10px 10px 150px rgba(0, 0, 0, 0.1);
  display: flex;
  @media (max-width: 900px) {
    width: 100%;
    height: 100%;
  }
`

/** Wrapper for the entire Question Component */
export const StepContainer = styled.div`
  background-color: ${colors.white};
  width: 80%;
  height: 90%;
  max-width: 1440px;
  @media (max-width: 900px) {
    width: 100%;
    height: 100%;
  }
  position: relative;
`

export const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  padding: 0 5%;

  @media (min-width: 901px) {
    overflow-y: scroll;
    height: 80%;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 20%;
  padding-top: 50px;
  & > * {
    position: absolute;

    text-align: center;
    color: #815ed4;
  }
  @media (min-width: 900px) {
    & > * {
      position: static;
    }
  }

  // background: pink;
`

// button color should be: #815ED4
export const BackButton = styled.div`
  left: 10%;
  margin-left: 15%;
`
export const NextButton = styled.div`
  right: 10%;
  margin-right: 15%;

  @media (min-width: 900px) {
    margin-left: auto;
  }
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
