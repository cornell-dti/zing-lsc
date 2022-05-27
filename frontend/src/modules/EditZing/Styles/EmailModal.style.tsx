import styled from 'styled-components'
import { h4 } from '@core'

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 3.5rem 0 3.5rem;
`

export const RecipientsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const LabelText = styled.text`
  ${h4};
  font-family: Montserrat;
  font-weight: 500;
  margin-right: 0.5rem;
`

export const RecipientsText = styled.text`
  ${h4};
  font-family: Montserrat;
  font-weight: 700;
`
