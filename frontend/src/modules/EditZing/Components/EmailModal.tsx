// external imports
import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useParams } from 'react-router-dom'
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
  selectedStudents,
  isEmailing,
  setIsEmailing,
  courseNames,
  setEmailSent,
  setEmailSentError,
  handleEmailTimestamp,
}: EmailModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>(
    '' as TemplateName
  )

  const { courseId } = useParams<{ courseId: string }>()
  const [step, setStep] = useState<number>(0)
  const titles = [
    'Select email template',
    'Send emails',
    'Auth Error',
    'Fatal Error',
  ]
  const title = titles[step]

  // ======= Send Email Helper Functions =======

  /**
   *
   * @param group object
   * @returns the student emails for a given group in a string array.
   */
  const groupEmails = (group: any) => {
    return [
      'lscstudypartners@cornell.edu',
      ...group.memberData.map((mem: any) => mem.email),
    ]
  }

  /**
   * promise that sends emails to each group.
   *
   * @returns true if there are any errors in sending the email OR false if no errors
   */
  const sendGroupEmails = async () => {
    let failure = false

    await Promise.all([
      selectedGroups.map((group) => {
        const emailRcpts = groupEmails(group)
        const emailBody = getBody(selectedTemplate, courseNames.join(', '))
        const emailSubject = 'Study Partners!'
        const groupNum = group.groupNumber.toString()
        const emailItems = {
          emailSubject,
          emailRcpts,
          emailBody,
          courseId,
          groupNum,
          selectedTemplate,
        }
        return sendEmail(emailItems).then((res) => {
          if (res === false) failure = true
        })
      }),
      selectedStudents.map((student) => {
        const emailRcpts = [student]
        const emailBody = getBody(selectedTemplate, courseNames.join(', '))
        const emailSubject = 'Study Partners!'
        const emailItems = {
          emailSubject,
          emailRcpts,
          emailBody,
          courseId,
          groupNum: -1,
          selectedTemplate,
        }
        return sendEmail(emailItems).then((res) => {
          if (res === false) failure = true
        })
      }),
    ])

    // emailStudents().then((res) => {
    //   if (res === false) failure = true
    // })

    return failure
  }

  /**
   * Handles the emailing sending when clicked the send mail button.
   */
  const handleEmailSend = async () => {
    try {
      const failure = await sendGroupEmails()
      if (failure) {
        step === 2 ? setStep(3) : setStep(2)
        setEmailSentError(true)
      } else {
        setEmailSent(true)
        setIsEmailing(false)
        handleEmailTimestamp()
      }
    } catch (e) {
      console.log(`error was ${e}`)
    }
  }

  const TemplateSelectedComponent = () => {
    return (
      <Box sx={{ marginTop: '0.25em', marginBottom: '0.5em' }}>
        <Typography variant="h5" component="h5">
          Template:
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
          paddingTop: '8%',
        }}
      >
        <Typography variant="h5" component="h5" fontWeight={'400'}>
          Uh oh... Something went wrong when trying to send the email. Try again
          to reauthenticate. <br></br>
          <br></br>
          <em>
            *This will automatically attempt to send the email one more time.
          </em>
        </Typography>
        <Button
          onClick={() => {
            adminSignIn().then(() => handleEmailSend())
          }}
          sx={{ position: 'absolute', bottom: '20%' }}
        >
          Try Again
        </Button>
      </Box>
    )
  }

  /** Step 3
   *  Show email send failure screen
   *  Try Again Button */
  const StepFinalFailure = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '8%',
        }}
      >
        <Typography variant="h5" component="h5" fontWeight={'400'}>
          Looks like something went wrong. Please contact DTI with the following
          error reference for more information.
          <br />
          <br />
          <Typography variant="h5" fontWeight="700">
            Error reference:
          </Typography>
          Email final auth failure step.
        </Typography>
        <Button
          onClick={() => {
            setIsEmailing(false)
          }}
          sx={{ position: 'absolute', bottom: '20%' }}
        >
          Close
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
    } else if (step === 1) {
      return (
        <Button
          onClick={() => {
            handleEmailSend()
          }}
          endIcon={<SendIcon />}
        >
          Send {selectedGroups.length} Emails
        </Button>
      )
    } else return null
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
        <Box
          display={'flex'}
          justifyContent={'center'}
          textAlign={'center'}
          paddingTop="20px"
        >
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
