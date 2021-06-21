import styled from 'styled-components'
import { colors, h2, h4 } from '@core'

import { YearField } from '@core'
import { withStyles } from '@material-ui/core/styles'

export const StyledContainer = styled.div`
  margin: auto;
`

export const StyledText = styled.text`
  ${h2};
  color: ${colors.black};
  font-weight: 500;
  line-height: 10px;
`

export const StyledEverythingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  justify-content: center;
  align-items: center;
`

export const StyledYearField = withStyles({
  root: {
    background: 'white',
    borderRadius: 3,
    border: 0,
    height: 48,
    padding: '0 30px',
  },
})(YearField)

export const StyledYearFieldWrapper = styled.div`
  width: 12rem;
`

export const StyledErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  padding-bottom: 0.5rem;
`

export const StyledErrorText = styled.text`
  ${h4};
  color: ${colors.red};
  padding-left: 0.5rem;
  font-weight: 500;
  position: relative;
`
