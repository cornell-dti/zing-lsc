import React from 'react'
import { ZingModal } from '@core/Components'
import { EmailModalProps } from '../Types/ComponentProps'
import { FakeEmailTemplates } from './fakeEmailData'

export const EmailModal = ({ isEmailing, setIsEmailing }: EmailModalProps) => {
  const Recipients = () => {}
  const ChooseTemplate = () => {}

  return (
    <ZingModal
      title="Select an email template"
      titleFontSize="36px"
      open={isEmailing}
      onClose={() => setIsEmailing(!isEmailing)}
      primaryButtonText="Send"
      primaryButtonProps={{ onClick: () => alert('hi') }}
      containerWidth={'800px'}
      containerHeight={'450px'}
      children={<div />}
    />
  )
}
