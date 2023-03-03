// external imports
import { useState } from 'react'
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
import EditIcon from '@mui/icons-material/Edit'
// template editor
import { EmailTemplate } from '@core/Types'
import { useStudentValue } from '@context/StudentContext'
import { useCourseValue } from '@context/CourseContext'
import { useTemplateValue } from '@context/TemplateContext'
import { EmailEdit } from 'EditZing/Components/EmailEdit'
export const EmailModal = ({
  selectedGroupNumbers,
  selectedStudentEmails,
  isEmailing,
  setIsEmailing,
  courseNames,
  setEmailSent,
  setEmailSaved,
  setEmailSentError,
}: EmailModalProps) => {
  const { courseId } = useParams<{ courseId: string }>()
  const { addGroupEmailTimestamps } = useCourseValue()
  const { addStudentEmailTimestamps } = useStudentValue()
  const { templates } = useTemplateValue()

  // check if emailing students or groups
  const recipientType = selectedStudentEmails.length > 0 ? 'student' : 'group'

  const filteredTemplates = templates.filter(
    (template) => template.type === recipientType
  )

  // template editor logic
  const [selectedTemplate, setSelectedTemplate] = useState<
    EmailTemplate | undefined
  >(undefined)

  // Special value substitution in template HTML
  const replaceMap = {
    '{{COURSE_NAME}}': courseNames.join('/'),
  }
  const replacedHtml = Object.entries(replaceMap).reduce(
    (prev, [key, value]) => prev.replaceAll(key, value),
    selectedTemplate?.html || ''
  )

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
   * promise that sends emails to each individual student.
   *
   * @throws error if there are any errors in sending the email
   */
  const sendIndividualEmails = async () => {
    await Promise.all(
      selectedStudentEmails.map((studentEmail: string) => {
        const emailSubject = selectedTemplate?.subject
        const emailItems = {
          emailSubject,
          indivEmail: studentEmail,
          emailBody: replacedHtml,
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
      selectedGroupNumbers.map((groupNumber) => {
        const emailSubject = selectedTemplate?.subject
        const emailItems = {
          emailSubject,
          indivEmail: undefined,
          emailBody: replacedHtml,
          courseId,
          groupNum: groupNumber.toString(),
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
      if (recipientType === 'student') {
        await sendIndividualEmails()
        addStudentEmailTimestamps(
          selectedStudentEmails,
          courseId,
          selectedTemplate!.id,
          new Date()
        )
      } else {
        await sendGroupEmails()
        addGroupEmailTimestamps(
          selectedGroupNumbers,
          courseId,
          selectedTemplate!.id,
          new Date()
        )
      }
      setEmailSent(true)
      setIsEmailing(false)
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
          Template:{' '}
          <Box component="span" sx={{ fontWeight: 800 }}>
            {selectedTemplate?.name}
          </Box>
        </Typography>
      </Box>
    )
  }

  const EditButton = () => {
    if (step === 1) {
      return (
        <Button
          onClick={() => {
            setStep(4)
          }}
          color="primary"
          variant="text"
          sx={{ alignSelf: 'end' }}
        >
          <EditIcon sx={{ marginRight: '5px' }} />
          Edit Template
        </Button>
      )
    } else {
      return null
    }
  }

  const EditEmail = () => {
    return (
      <Box>
        <TemplateSelectedComponent />
        <EmailEdit
          template={selectedTemplate!}
          replacedHtml={replacedHtml}
          setSelectedTemplate={setSelectedTemplate}
          setEmailSaved={setEmailSaved}
        />
      </Box>
    )
  }
  const Step0 = () => {
    return (
      <Box>
        <EmailTemplateButtons
          templates={filteredTemplates}
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <EmailPreview
            template={selectedTemplate!}
            replacedHtml={replacedHtml}
          />
        </Box>
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
          Send{' '}
          {recipientType === 'group'
            ? selectedGroupNumbers.length
            : selectedStudentEmails.length}{' '}
          Emails
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
          color="secondary"
          variant="outlined"
        >
          Back to templates
        </Button>
      )
    } else if (step === 4) {
      return (
        <Button
          onClick={() => {
            setStep(1)
          }}
          color="secondary"
          variant="outlined"
        >
          Back to preview
        </Button>
      )
    } else {
      return null
    }
  }

  const SelectTemplates = () => {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
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
              {selectedGroupNumbers
                .map((groupNumber) => `Group ${groupNumber}`)
                .join(', ')}
              {selectedStudentEmails.join(', ')}
            </Box>
          </Typography>
          {step === 1 && <EditButton />}
        </Box>
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
        {filteredTemplates.length !== 0 ? (
          <Box sx={{ padding: '1rem 3.5rem 0 3.5rem' }}>
            {step <= 1 && <SelectTemplates />}
            {step === 2 && <StepFailure />}
            {step === 3 && <StepFinalFailure />}
            {step === 4 && <EditEmail />}
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
