import styled from 'styled-components'
import { SuccessIcon } from 'Survey/Types'

const Check = ({ className, src }: SuccessIcon) => (
  <div className={className}>
    <img src={src} alt="check" />
  </div>
)

export const StyledCheck = styled(Check)`
  margin-right: 6%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
