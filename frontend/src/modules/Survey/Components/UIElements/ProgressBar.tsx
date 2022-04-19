import React from 'react'
import styled from 'styled-components'

interface ProgressBarProps {
  stepNumber: number
  totalSteps: number
}

const ProgressBar = ({ stepNumber, totalSteps }: ProgressBarProps) => {
  const StyledPBContainer = styled.div`
    width: 100%;
    background-color: white;
  `
  const StyledPBFiller = styled.div`
    height: 100%;
    width: ${(stepNumber / totalSteps) * 100}%;
    background: linear-gradient(113.81deg, #cd9cf2 18.37%, #d9b6f6 37.06%);
    text-align: right;
  `
  const StyledPBLabel = styled.span`
    padding: 5px;
    color: white;
  `
  return (
    <StyledPBContainer>
      <StyledPBFiller>
        <StyledPBLabel>{`${stepNumber}/${totalSteps}`}</StyledPBLabel>
      </StyledPBFiller>
    </StyledPBContainer>
  )
}

export default ProgressBar
