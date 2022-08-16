// external imports
import { useState, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useParams } from 'react-router-dom'
// zing imports
import { ZingModal } from '@core/Components'
import { EmailModalProps } from '../Types/ComponentProps'
import { EmailTemplateButtons } from 'EditZing/Components/EmailTemplateButtons'
import { EmailPreview } from 'EditZing/Components/EmailPreview'
import { sendEmail } from 'Emailing/Components/Emailing'
import { adminSignIn } from '@fire/firebase'

// template editor
import { templatesBucket } from '@fire/firebase'
import { API_ROOT, EMAIL_PATH } from '@core/Constants'
import {
  EmailTemplate,
  EmailTemplatesResponse,
  responseEmailTemplateToEmailTemplate,
} from '@core/Types'
import axios, { AxiosResponse } from 'axios'
import { getDownloadURL, ref } from 'firebase/storage'

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
  // check if emailing students or groups
  const recipientType = selectedStudents.length > 0 ? 'student' : 'group'

  // template editor logic
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>()

  useEffect(() => {
    axios
      .get(`${API_ROOT}${EMAIL_PATH}/templates`)
      .then(async (res: AxiosResponse<EmailTemplatesResponse>) => {
        const allTemplates = await Promise.all(
          res.data.data
            .map(responseEmailTemplateToEmailTemplate)
            .map(async (template: EmailTemplate, i) => {
              // Download the HTML for the email body in Cloud Storage bucket
              const url = await getDownloadURL(
                ref(templatesBucket, template.body)
              )
              const html = (await axios.get(url)).data as string
              return { ...template, html }
            })
        )
        const filteredTemplates = allTemplates.filter(
          (template) => template.type === recipientType
        )
        setTemplates(filteredTemplates)
        setSelectedTemplate(filteredTemplates[0])
      })
      .catch((error) => console.error(error))
  }, [recipientType])

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
   * promise that sends emails to each individual student.
   *
   * @throws error if there are any errors in sending the email
   */
  const sendIndividualEmails = async () => {
    await Promise.all(
      selectedStudents.map((student: string) => {
        const emailRcpts = [student, 'lscstudypartners@cornell.edu']
        const emailSubject = selectedTemplate?.subject
        const emailItems = {
          emailSubject,
          emailRcpts,
          emailBody: selectedTemplate?.html,
          courseId,
          groupNum: undefined,
          selectedTemplate: selectedTemplate?.id,
        }
        return sendEmail(emailItems)
      })
    )
  }

  /**
   * promise that sends emails to each group.
   *
   * @throws error if there are any errors in sending the email
   */
  const sendGroupEmails = async () => {
    await Promise.all(
      selectedGroups.map((group) => {
        const emailRcpts = groupEmails(group)
        const emailSubject = selectedTemplate?.subject
        const groupNum = group.groupNumber.toString()
        const emailItems = {
          emailSubject,
          emailRcpts,
          emailBody: selectedTemplate?.html,
          courseId,
          groupNum,
          selectedTemplate: selectedTemplate?.id,
        }
        return sendEmail(emailItems)
      })
    )
  }

  /**
   * Handles the emailing sending when clicked the send mail button.
   */
  const handleEmailSend = async () => {
    try {
      await sendGroupEmails()
      await sendIndividualEmails()
      setEmailSent(true)
      setIsEmailing(false)
      handleEmailTimestamp()
    } catch (e) {
      step === 2 ? setStep(3) : setStep(2)
      setEmailSentError(true)
      console.log(`error was ${e}`)
    }
  }

  const TemplateSelectedComponent = () => {
    return (
      <Box sx={{ marginTop: '0.25em', marginBottom: '0.5em' }}>
        <Typography variant="h5" component="h5">
          Template:
          <Box component="span" sx={{ fontWeight: 800 }}>
            {selectedTemplate?.name}
          </Box>
        </Typography>
      </Box>
    )
  }

  const Step0 = () => {
    return (
      <Box>
        <EmailTemplateButtons
          templates={templates}
          selectedTemplate={selectedTemplate!}
          setSelectedTemplate={setSelectedTemplate}
        />
      </Box>
    )
  }

  const Step1 = () => {
    return (
      <Box>
        <TemplateSelectedComponent />
        <EmailPreview template={selectedTemplate!} courseNames={courseNames} />
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
          flexFlow: 'column nowrap',
          gap: '1rem',
        }}
      >
        <Typography variant="h5" component="h5" fontWeight={'400'}>
          Uh oh... Something went wrong when trying to send the email. Try again
          to reauthenticate.
        </Typography>
        <Typography
          variant="h5"
          component="h5"
          fontWeight={'400'}
          sx={{ fontStyle: 'italic' }}
        >
          *This will automatically attempt to send the email one more time.
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
          flexFlow: 'column nowrap',
          gap: '2rem',
        }}
      >
        <Typography variant="h5" component="h5" fontWeight={'400'}>
          Looks like something went wrong. Please contact DTI with the following
          error reference for more information. Try reloading, reloggin in, or
          try again later.
        </Typography>
        <Typography variant="h5" fontWeight="700">
          Error reference:
          <Typography variant="h5" component="h5" fontWeight={'400'}>
            Email final auth failure step.
          </Typography>
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
          Send {selectedGroups.length > 0 && selectedGroups.length}
          {selectedStudents.length > 0 && selectedStudents.length} Emails
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
          <Box
            component="span"
            sx={{ fontWeight: 900, maxWidth: '90%', wordBreak: 'break-word' }}
          >
            {selectedGroups
              .map(({ groupNumber }) => `Group ${groupNumber}`)
              .join(', ')}
            {selectedStudents.join(', ')}
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
        {selectedTemplate ? (
          <Box sx={{ padding: '1rem 3.5rem 0 3.5rem' }}>
            {step <= 1 && <SelectTemplates />}
            {step === 2 && <StepFailure />}
            {step === 3 && <StepFinalFailure />}
          </Box>
        ) : (
          <Box
            sx={{
              padding: '1rem 3.5rem 0 3.5rem',
              textAlign: 'center',
              display: 'flex',
              flexFlow: 'column nowrap',
              gap: '10rem',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">
              No Templates for the selected group.
            </Typography>
            <Button href="/templates" sx={{ width: '250px' }}>
              Add Templates
            </Button>
          </Box>
        )}
      </ZingModal.Body>
      <ZingModal.Controls>
        <BackButton />
        <ProceedButton />
      </ZingModal.Controls>
    </ZingModal>
  )
}
