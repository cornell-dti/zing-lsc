import styled, { css } from 'styled-components'

import { colors, h3 } from '@core'

const defaultContainerStyle = css`
  text-align: left;
  justify-content: center;
  align-items: center;
  color: ${colors.black};
  width: 100%;
  cursor: pointer;
`

export const StyledContainer = styled.div`
  ${defaultContainerStyle}
  display: flex;
  justify-content: flex-start;
  padding: 0 1rem;

  background: ${colors.white};
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 11px;
  margin-bottom: 1rem;
  box-sizing: border-box;
`

const defaultLabelStyle = css`
  ${h3};
  font-weight: 400;
`

export const StyledLabel = styled.label`
  ${defaultLabelStyle}
`
