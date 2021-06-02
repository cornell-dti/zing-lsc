import React from 'react'

import styled, { css } from 'styled-components'
import logo from '@assets/img/purplelogo.svg'
import { colors, h2, h3, StyledComponent } from '@core'
import bg2 from '@assets/img/bg2.svg'
import { Question } from '../Components/Question'

const Logo = ({ className }: StyledComponent) => (
  <div className={className}>
    <img src={logo} alt="logo" />
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
  height: 86%;
  width: 80%;
  background-color: ${colors.white};
  box-shadow: -10px -10px 150px rgba(0, 0, 0, 0.1),
    10px 10px 150px rgba(0, 0, 0, 0.1);

  display: flex;
`

export const StyledQuestionWrapper = styled.div`
  height: 88%;
  width: 80%;
  padding-left: 1.5rem;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
  position: relative;
  background: #f6f3ff;
  border-radius: 20px;
  display: flex;
  margin: 0.5rem;
`

export const StyledWrapper = styled.div`
  display: flex;
`
export const StyledHeaderWrapper = styled.div`
  height: 7%;
  display: flex;
  flex-direction: column;
`
export const StyledLogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

export const StyledLogo = styled(Logo)``

export const StyledOuterContainer = styled.div`
  height: 100%;
  background-image: url(${bg2});
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledText = styled.text`
  ${h3};
  font-weight: 500;
  line-height: 20px;
`

export const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const StyledQuestion = styled(Question)``

export const StyledQuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.25rem;
  justify-content: center;
  align-items: center;
`
