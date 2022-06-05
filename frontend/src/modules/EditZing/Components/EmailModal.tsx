import { ZingModal } from '@core/Components'
import { EmailModalProps } from '../Types/ComponentProps'
import { useState } from 'react'
import { TemplateName } from 'EditZing/utils/emailTemplates'
import { Box, Button, Typography } from '@mui/material'
import { EmailTemplateButtons } from 'EditZing/Components/EmailTemplateButtons'
import { EmailPreview } from 'EditZing/Components/EmailPreview'
import SendIcon from '@mui/icons-material/Send'

export const EmailModal = ({
  selectedGroups,
  isEmailing,
  setIsEmailing,
  courseNames,
}: EmailModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>(
    '' as TemplateName
  )
  const [step, setStep] = useState<number>(0)
  const titles = ['Select email template', 'Send emails']
  const title = titles[step]

  const TemplateSelectedComponent = () => {
    return (
      <Box sx={{ marginTop: '0.25em', marginBottom: '0.5em' }}>
        <Typography variant="h5" component="h5">
          Template:{' '}
          <Box component="span" sx={{ fontWeight: 800 }}>
            {selectedTemplate}
          </Box>
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
        >
          Back to templates
        </Button>
      )
    } else {
      return null
    }
  }

  return (
    <ZingModal
      open={isEmailing}
      onClose={() => setIsEmailing(!isEmailing)}
      containerWidth={'800px'}
      containerHeight={'630px'}
    >
      <ZingModal.Title onClose={() => setIsEmailing(!isEmailing)}>
        <Box display={'flex'} justifyContent={'center'} textAlign={'center'}>
          <Typography variant="h4" component="h4" fontWeight={'700'}>
            {title}
          </Typography>
        </Box>
      </ZingModal.Title>
      <ZingModal.Body>
        <Box sx={{ padding: '1rem 3.5rem 0 3.5rem' }}>
          {' '}
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: 'flex', gap: 1 }}
          >
            <Box component="span">To:</Box>
            <Box component="span" sx={{ fontWeight: 900 }}>
              {selectedGroups
                .map(({ groupNumber }) => `Group ${groupNumber}`)
                .join(', ')}
            </Box>
          </Typography>
          {step === 0 ? <Step0 /> : <Step1 />}
        </Box>
      </ZingModal.Body>
      <ZingModal.Controls>
        <BackButton />
        <ProceedButton />
      </ZingModal.Controls>
    </ZingModal>
  )
}
