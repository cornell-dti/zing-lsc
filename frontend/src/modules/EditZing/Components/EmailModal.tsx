// external imports
import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
// zing imports
import { getBody } from '../utils/emailTemplates'
import { ZingModal } from '@core/Components'
import { EmailModalProps } from '../Types/ComponentProps'
import { TemplateName } from 'EditZing/utils/emailTemplates'
import { EmailTemplateButtons } from 'EditZing/Components/EmailTemplateButtons'
import { EmailPreview } from 'EditZing/Components/EmailPreview'
import { sendEmail } from 'Emailing/Components/Emailing'
import { adminSignIn } from '@fire/firebase'

export const EmailModal = ({
  selectedGroups,
  isEmailing,
  setIsEmailing,
  courseNames,
  setEmailSent,
  setEmailSentError,
}: EmailModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>(
    '' as TemplateName
  )
  const [step, setStep] = useState<number>(0)
  const titles = ['Select email template', 'Send emails']
  const title = titles[step]
  const [sendError, setSendError] = useState<boolean | null>(null)

  // ======= Send Email Helper Functions =======

  const groupEmails = async (group: any) => {
    const rcpts: string[] = []
    const members = group.memberData
    await members.forEach((mem: any) => {
      rcpts.push(mem.email)
    })
    return rcpts
  }

  const sendGroupEmails = async () => {
    let failure = false
    selectedGroups.forEach(async (group) => {
      const emailRcpts = await groupEmails(group)
      const emailBody = getBody(selectedTemplate, courseNames.join(', '))
      const emailSubject = 'Study Partners!'
      const emailItems = { emailSubject, emailRcpts, emailBody }
      await sendEmail(emailItems)
        .then((result) => {
          if (result === false) {
            failure = true
            setSendError(true)
          }
        })
        .then((result) => {
          console.log(
            `Result from sending email: ${result}. \n Send Error is : ${sendError}`
          )
        })
    })
    return failure
  }

  const sendEmails = async () => {
    try {
      await sendGroupEmails().then((res) => {
        console.log(`send group emails result: ${res}`)
        setSendError(res)
      })
      console.log(`After sending group email, sendError is ${sendError}`)
      setIsEmailing(false)
    } catch (e) {
      console.log(`error was ${e}`)
    }
  }

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

  /** Step 2
   *  Show email send failure screen
   *  Try Again Button */
  const StepFailure = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '15%',
        }}
      >
        <Typography variant="h5" component="h5" fontWeight={'700'}>
          Uh oh... Something went wrong when trying to send the email. Try to
          sign in one more time. <br></br>
          <br></br>
          <em>
            {' '}
            This will automatically attempt to send the email one more time.{' '}
          </em>
        </Typography>
        <Button
          onClick={() => {
            adminSignIn().then(() => sendEmails())
          }}
          sx={{ position: 'absolute', bottom: '25%' }}
        >
          Try Again{' '}
        </Button>
      </Box>
    )
  }

  /** Step 3
   *  Show email send failure screen
   *  Try Again Button */
  const StepFinalFailure = () => {
    return (
      <Box>
        <Typography variant="h5" component="h5" fontWeight={'700'}>
          Uh oh ... looks like something went wrong. Please contact DTI.
        </Typography>
        <Button
          onClick={() => {
            setIsEmailing(false)
          }}
        >
          Close{' '}
        </Button>
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
    } else if (step === 2) {
      return (
        <Button
          onClick={() => {
            setIsEmailing(!isEmailing)
          }}
          sx={{ position: 'absolute', bottom: '24px', right: '24px' }}
        >
          Close
        </Button>
      )
    } else {
      return (
        <Button
          onClick={() => {
            // setIsEmailing(!isEmailing)
            sendEmails().then(() =>
              sendError === true ? setEmailSentError(true) : setEmailSent(true)
            )
            console.log('sending email')
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

  const SelectTemplates = () => {
    return (
      <>
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
        {step === 0 && <Step0 />}
        {step === 1 && <Step1 />}
      </>
    )
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
          {step === 2 ? (
            <StepFailure />
          ) : step === 3 ? (
            <StepFinalFailure />
          ) : (
            <SelectTemplates />
          )}
        </Box>
      </ZingModal.Body>
      <ZingModal.Controls>
        <BackButton />
        <ProceedButton />
      </ZingModal.Controls>
    </ZingModal>
  )
}
