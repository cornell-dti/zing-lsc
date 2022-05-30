import { useState } from 'react'
import { EmailModalContentProps } from '../Types/ComponentProps'
import {
  ModalContainer as ContentContainer,
  RecipientsContainer as InfoContainer,
} from '../Styles/Email.style'
import { EmailTemplateButtons } from './EmailTemplateButtons'
import { EmailPreview } from './EmailPreview'
import { Box, Button, Typography } from '@mui/material'
import { TemplateName } from 'EditZing/utils/emailTemplates'
import SendIcon from '@mui/icons-material/Send'

export const EmailModalContent = ({
  selectedGroups,
  courseNames,
  isEmailing,
  setIsEmailing,
}: EmailModalContentProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>(
    '' as TemplateName
  )
  const [step, setStep] = useState<number>(0)
  const titles = ['Select email template', 'Send emails']

  const RecipientsComponent = () => {
    let groupNames = ''
    selectedGroups.forEach((group, index) => {
      if (index !== selectedGroups.length - 1) {
        groupNames += `Group ${group.groupNumber}, `
      } else {
        groupNames += `Group ${group.groupNumber}`
      }
    })
    return (
      <InfoContainer>
        <Typography variant="h5" component="h5">
          To:
        </Typography>
        &nbsp;&nbsp;
        <Typography variant="h5" component="h5" fontWeight={'900'}>
          {groupNames}
        </Typography>
      </InfoContainer>
    )
  }

  const TemplateSelectedComponent = () => {
    return (
      <InfoContainer style={{ marginTop: '0.25em', marginBottom: '0.5em' }}>
        <Typography variant="h5" component="h5">
          Template:
        </Typography>
        &nbsp;&nbsp;
        <Typography variant="h5" component="h5" fontWeight={'800'}>
          {selectedTemplate}
        </Typography>
      </InfoContainer>
    )
  }

  const TitleComponent = () => {
    const title = titles[step]
    return (
      <Box display={'flex'} justifyContent={'center'} textAlign={'center'}>
        <Typography variant="h4" component="h4" fontWeight={'700'}>
          {title}
        </Typography>
      </Box>
    )
  }

  const Step0 = () => {
    return (
      <Box>
        <EmailTemplateButtons
          selectedTemplate={selectedTemplate || ''}
          setSelectedTemplate={setSelectedTemplate}
        />
      </Box>
    )
  }

  const Step1 = () => {
    return (
      <Box>
        <TemplateSelectedComponent />
        <EmailPreview
          templateName={selectedTemplate}
          courseNames={courseNames}
        />
      </Box>
    )
  }

  const ProceedButton = () => {
    if (step === 0) {
      return (
        <Button
          onClick={() => {
            setStep(1)
          }}
          disabled={!selectedTemplate}
          sx={{ position: 'absolute', bottom: '24px', right: '24px' }}
        >
          Next
        </Button>
      )
    } else {
      return (
        <Button
          onClick={() => {
            setIsEmailing(!isEmailing)
            // add something else here that actually sends the emails and a pop-up message saying that it's in-progress then done/fail etc.
          }}
          endIcon={<SendIcon />}
          sx={{ position: 'absolute', bottom: '24px', right: '24px' }}
        >
          Send {selectedGroups.length} Emails
        </Button>
      )
    }
  }

  const BackButton = () => {
    if (step === 1) {
      return (
        <Button
          onClick={() => {
            setStep(0)
          }}
          color="inherit"
          sx={{ position: 'absolute', bottom: '24px', left: '24px' }}
        >
          Back to templates
        </Button>
      )
    } else {
      return null
    }
  }

  return (
    <Box>
      <TitleComponent />
      <ContentContainer>
        <RecipientsComponent />
        {step === 0 ? <Step0 /> : <Step1 />}
      </ContentContainer>
      <ProceedButton />
      <BackButton />
    </Box>
  )
}
