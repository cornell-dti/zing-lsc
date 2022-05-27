import React from 'react'
import { ZingModal } from '@core/Components'
import { EmailModalProps } from '../Types/ComponentProps'
import {
  LabelText,
  ModalContainer,
  RecipientsContainer,
  RecipientsText,
} from '../Styles/EmailModal.style'

export const EmailModal = ({
  selectedGroups,
  isEmailing,
  setIsEmailing,
}: EmailModalProps) => {
  const recipients = () => {
    return (
      <RecipientsContainer>
        <LabelText>To:</LabelText>
        {selectedGroups.map((group, index) =>
          index === selectedGroups.length - 1 ? (
            <RecipientsText key={group.groupNumber}>
              {'Group ' + group.groupNumber}
            </RecipientsText>
          ) : (
            <RecipientsText key={group.groupNumber}>
              {'Group ' + group.groupNumber + ', '}
            </RecipientsText>
          )
        )}
      </RecipientsContainer>
    )
  }
  const templateRadioButtons = () => {}

  const contentComponent = () => {
    return <ModalContainer>{recipients()}</ModalContainer>
  }

  return (
    <ZingModal
      title="Select email template"
      titleFontSize="36px"
      open={isEmailing}
      onClose={() => setIsEmailing(!isEmailing)}
      primaryButtonText="Send"
      primaryButtonProps={{ onClick: () => alert('hi') }}
      containerWidth={'800px'}
      containerHeight={'450px'}
      children={contentComponent()}
    />
  )
}
