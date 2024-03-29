import styled from 'styled-components'
import { BsChevronDown } from 'react-icons/bs'
import { colors, h4 } from '@core'

export const StyledContainer = styled.main`
  height: 100%;
  width: 100%;
  background-color: ${colors.white};
  box-shadow: -10px -10px 150px rgba(0, 0, 0, 0.05),
    10px 10px 150px rgba(0, 0, 0, 0.05);
  border-radius: 30px;

  display: flex;
  flex-direction: column;
`

export const StyledHeaderMenu = styled.div`
  height: fit-content;

  padding: 3% 5%;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-around;
`

export const StyledName = styled.div`
  ${h4};
  font-weight: 600;
  color: ${colors.white};

  display: flex;
  align-items: center;
`

export const StyledArrowDown = styled(BsChevronDown)`
  margin-left: 0.2rem;
  cursor: pointer;
`

export const StyledModalContainer = styled.div`
  outline: 0;
  width: 80%;
  height: 95%;
  overflow: auto;
`
