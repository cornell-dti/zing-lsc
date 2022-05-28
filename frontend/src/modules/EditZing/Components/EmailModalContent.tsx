import { useState } from 'react'
import { EmailModalContentProps } from '../Types/ComponentProps'
import {
  ModalContainer,
  RecipientsContainer as InfoContainer,
} from '../Styles/EmailModal.style'
import { EmailTemplateButtons } from './EmailTemplateButtons'
import { Box, Button, Typography } from '@mui/material'
import { TemplateName } from 'EditZing/utils/emailTemplates'

export const EmailModalContent = ({
  selectedGroups,
}: EmailModalContentProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>(
    '' as TemplateName
  )
  const [step, setStep] = useState<number>(1)

  const RecipientsComponent = () => {
    return (
      <InfoContainer>
        <Typography variant="h5" component="h5" mr="0.5rem">
          To:
        </Typography>
        {selectedGroups.map((group, index) =>
          index === selectedGroups.length - 1 ? (
            <Typography variant="h5" component="h5" fontWeight={'800'}>
              {'Group ' + group.groupNumber}
            </Typography>
          ) : (
            <Typography variant="h5" component="h5" fontWeight={'800'}>
              {'Group ' + group.groupNumber + ', '}
            </Typography>
          )
        )}
      </InfoContainer>
    )
  }

  const TemplateSelectedComponent = () => {
    return (
      <InfoContainer style={{ marginTop: '45px' }}>
        <Typography variant="h5" component="h5" mr="0.5rem">
          Template:
        </Typography>
        <Typography variant="h5" component="h5" fontWeight={'800'}>
          {selectedTemplate}
        </Typography>
      </InfoContainer>
    )
  }

  const titleComponent = () => {
    let title
    step === 1 ? (title = 'Select email template') : (title = 'Send emails')
    return (
      <Box display={'flex'} justifyContent={'center'} textAlign={'center'}>
        <Typography variant="h4" component="h4" fontWeight={'700'} mb="12px">
          {title}
        </Typography>
      </Box>
    )
  }

  // TODO: refactor this when first draft is done to minimize code overlap (conditionals only on things that change)
  if (step === 1) {
    return (
      <Box>
        {titleComponent()}
        <ModalContainer>
          <RecipientsComponent />
          <EmailTemplateButtons
            selectedTemplate={selectedTemplate || ''}
            setSelectedTemplate={setSelectedTemplate}
          />
        </ModalContainer>
        <Button
          onClick={() => {
            setStep(2)
          }}
          disabled={!selectedTemplate}
          sx={{ position: 'absolute', bottom: '24px', right: '24px' }}
        >
          Next
        </Button>
      </Box>
    )
  } else {
    return (
      <Box>
        {titleComponent()}
        <ModalContainer>
          <RecipientsComponent />
          <TemplateSelectedComponent />
        </ModalContainer>
        <Button
          disabled={!selectedTemplate}
          sx={{ position: 'absolute', bottom: '24px', right: '24px' }}
        >
          Send emails
        </Button>
        <Button
          onClick={() => {
            setStep(1)
          }}
          color="inherit"
          sx={{ position: 'absolute', bottom: '24px', left: '24px' }}
        >
          Back to templates
        </Button>
      </Box>
    )
  }
}
