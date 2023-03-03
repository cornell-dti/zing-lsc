// external imports
import { useState } from 'react'
import {
  Box,
  Button,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useParams } from 'react-router-dom'

// zing imports
import { DropdownSelect, ZingModal } from '@core/Components'
import { EmailModalProps } from '../Types/ComponentProps'
import { EmailTemplateButtons } from 'EditZing/Components/EmailTemplateButtons'
import { EmailPreview } from 'EditZing/Components/EmailPreview'
import { sendEmail } from 'Emailing/Components/Emailing'
import { adminSignIn } from '@fire/firebase'
import EditIcon from '@mui/icons-material/Edit'

// template editor
import { Course, EmailTemplate, Group } from '@core/Types'
import { useStudentValue } from '@context/StudentContext'
import { useCourseValue } from '@context/CourseContext'
import { useTemplateValue } from '@context/TemplateContext'
import { EmailEdit } from './EmailEdit'

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
  const { addGroupEmailTimestamps, courses } = useCourseValue()
  const { addStudentEmailTimestamps, students } = useStudentValue()
  const { templates } = useTemplateValue()

  // check if emailing students or groups
  const recipientType = selectedStudentEmails.length > 0 ? 'student' : 'group'

  const filteredTemplates = templates.filter(
    (template) => template.type === recipientType
  )

  // template editor logic
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(
    filteredTemplates[0]
  )

  // Special value substitution in template HTML
  const replaceMap = {
    '{{COURSE_NAME}}': courseNames.join('/'),
  }

  const replacedHtml = Object.entries(replaceMap).reduce(
    (prev, [key, value]) => prev.replaceAll(key, value),
    selectedTemplate?.html || ''
  )

  /** Replaces {{NEW_STUDENT_NAME}} and {{OTHER_STUDENTS_NAMES}} with their proper values
   * in the email template. {replacedHtml} is a general replacement common to all groups, so
   * for this function, we must pass in the specific groupNumber and find the array of
   * group members' names using that, since this information is not available from {EmailModalProps}
   *
   * @param groupNumber
   */
  const studentNamesHtml = (groupNumber: number) => {
    const group = courses
      .find((course: Course) => course.courseId === courseId)
      ?.groups.find((group: Group) => group.groupNumber === groupNumber)

    if (!group) {
      return replacedHtml
    }

    const groupSize = group.members.length

    const members = group.members.map(
      (member) =>
        students.find((student) => student.email === member)?.name || ''
    )

    let newStudent = members[groupSize - 1]
    let otherStudents = members.slice(0, groupSize - 1)

    const replaceNamesMap = {
      '{{NEW_STUDENT_NAME}}': newStudent,
      '{{OTHER_STUDENTS_NAMES}}': otherStudents.join(', '),
    }

    return Object.entries(replaceNamesMap).reduce(
      (prev, [key, value]) => prev.replaceAll(key, value),
      replacedHtml
    )
  }

  const allGroupTemplates = selectedGroupNumbers.map((groupNumber) => ({
    groupNumber,
    template: studentNamesHtml(groupNumber),
  }))

  const [step, setStep] = useState<number>(0)
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
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
      selectedTemplate.name === 'Introducing student to established group'
        ? allGroupTemplates.map(({ groupNumber, template }) => {
            const emailSubject = selectedTemplate?.subject
            const emailItems = {
              emailSubject,
              indivEmail: undefined,
              emailBody: template,
              courseId,
              groupNum: groupNumber.toString(),
              selectedTemplate: selectedTemplate?.id,
            }
            return sendEmail(emailItems)
          })
        : selectedGroupNumbers.map((groupNumber) => {
            const emailSubject = selectedTemplate?.subject
            const emailItems = {
              emailSubject,
              indivEmail: undefined,
              emailBody: studentNamesHtml(groupNumber),
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
          <EditIcon style={{ marginRight: '5px' }} />
          Edit Template
        </Button>
      )
    } else {
      return null
    }
  }

  const EditEmail = ({ groupNumber }: { groupNumber: number }) => {
    return selectedTemplate.name ===
      'Introducing student to established group' ? (
      <Box>
        <TemplateSelectedComponent />
        <EmailEdit
          template={selectedTemplate!}
          replacedHtml={
            allGroupTemplates.find(
              (groupTemplate) => groupTemplate.groupNumber === groupNumber
            )?.template || ''
          }
          setSelectedTemplate={setSelectedTemplate}
          setEmailSaved={setEmailSaved}
        />
      </Box>
    ) : (
      <Box>
        <TemplateSelectedComponent />
        <EmailEdit
          template={selectedTemplate!}
          replacedHtml={studentNamesHtml(groupNumber)}
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

  const Step1 = ({
    groupNumbers,
    selectedTabIndex,
  }: {
    groupNumbers: number[]
    selectedTabIndex: number
  }) => {
    // Goes through all selected groups and generates individual templates.
    // TODO (richardgu): Make studentNamesHtml include regular replacedHtml function
    // for cases that aren't group-specific
    const groupTemplates =
      selectedTabIndex === 0 ? (
        allGroupTemplates.map(({ groupNumber, template }) => (
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '1rem',
              }}
            >
              <Box
                component="div"
                sx={{
                  fontSize: 24,
                  fontWeight: 900,
                  maxWidth: '90%',
                  whiteSpace: 'nowrap',
                }}
              >
                Group {groupNumber}
              </Box>

              <EmailPreview
                template={selectedTemplate!}
                replacedHtml={template}
              />
            </Box>
          </Box>
        ))
      ) : (
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <EmailPreview
              template={selectedTemplate!}
              replacedHtml={studentNamesHtml(selectedTabIndex)}
            />
          </Box>
        </Box>
      )

    return (
      <div>
        <TemplateSelectedComponent />
        {groupTemplates}
      </div>
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

  const [currGroup, setCurrGroup] = useState<string>('All groups')

  const changeCurrGroup = (event: SelectChangeEvent) => {
    setCurrGroup(event.target.value)
  }

  const GroupTabs = ({
    groupNumbers,
    selectedTabIndex,
  }: {
    groupNumbers: number[]
    selectedTabIndex: number
  }) => {
    const allGroups = [0, ...groupNumbers]

    return (
      <DropdownSelect
        value={currGroup}
        onChange={changeCurrGroup}
        sx={{
          padding: 0,
          margin: 0,
          fontWeight: 'bold',
          maxWidth: '250px',
        }}
      >
        {allGroups.map((groupNum: number, index: number) =>
          groupNum === 0 ? (
            <MenuItem value={index} onClick={() => setSelectedTabIndex(index)}>
              All Groups
            </MenuItem>
          ) : (
            <MenuItem value={index} onClick={() => setSelectedTabIndex(index)}>
              Group {index}
            </MenuItem>
          )
        )}
      </DropdownSelect>
    )
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
        {step === 1 &&
          selectedTemplate.name ===
            'Introducing student to established group' &&
          selectedGroupNumbers.length > 1 && (
            <GroupTabs
              groupNumbers={selectedGroupNumbers}
              selectedTabIndex={selectedTabIndex}
            />
          )}

        {step === 1 && (
          <Step1
            groupNumbers={selectedGroupNumbers}
            selectedTabIndex={selectedTabIndex}
          />
        )}
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
            {step === 4 && <EditEmail groupNumber={selectedTabIndex} />}
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
