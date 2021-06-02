import React, { FunctionComponent, useState } from 'react'
import {
  StyledContainer,
  StyledFullPanel,
  StyledWrapper,
  StyledLogoWrapper,
  StyledLogo,
  StyledQuestionWrapper,
  StyledOuterContainer,
  StyledText,
  StyledTextWrapper,
  StyledQuestion,
  StyledQuestionsWrapper,
} from '../Styles/FormStyle.style'
import { SubmitButton } from './SubmitButton'
import { colors } from '@core'

export const CreateZingForm = () => {
  const [groupName, setGroupName] = useState('')
  const [totalPeople, setTotalPeople] = useState('')
  const [studentsPerGroup, setStudentsPerGroup] = useState('')
  const [q1Error, setQ1Error] = useState('')
  const [q2Error, setQ2Error] = useState('')
  const [q3Error, setQ3Error] = useState('')
  const placeholder = 'Type your answer here...'
  const q1 = 'Name of Zing:'
  const q2 = 'Total number of students:'
  const q3 = 'Students per group:'
  const q1TextStyle = {
    fontWeight: '500',
    color: q1Error !== '' ? colors.red : colors.darkpurple,
  }

  const q2TextStyle = {
    fontWeight: '500',
    color: q2Error !== '' ? colors.red : colors.darkpurple,
  }

  const q3TextStyle = {
    fontWeight: '500',
    color: q3Error !== '' ? colors.red : colors.darkpurple,
  }
  function handleSubmit() {
    /* need to store errors locally since useStates get updated too slow 
    (after function finishes) */
    var error1: boolean
    var error2: boolean
    var error3: boolean
    // name validation
    if (groupName === '') {
      setQ1Error('Please enter a name')
      error1 = true
    } else {
      setQ1Error('')
      error1 = false
    }

    // total people validation
    if (Number(totalPeople) <= 0 || totalPeople === '') {
      setQ2Error('Please enter a valid number')
      error2 = true
    } else if (Number(totalPeople) < Number(studentsPerGroup)) {
      setQ2Error('Total people cannot be less than people per group')
      error2 = true
    } else {
      setQ2Error('')
      error2 = false
    }

    // students per group validation
    if (Number(studentsPerGroup) <= 0 || studentsPerGroup === '') {
      setQ3Error('Please enter a valid number')
      error3 = true
    } else if (Number(totalPeople) < Number(studentsPerGroup)) {
      setQ3Error('Total people cannot be less than people per group')
      error3 = true
    } else {
      setQ3Error('')
      error3 = false
    }
    // now check if there are any outstanding errors
    if (!error1 && !error2 && !error3) {
      // if not go to dashboard and there will be notif waiting for them
      alert('now you proceed back to dashboard (not implemented yet)')
    } else {
      // else stay here and show errors
      console.warn('some kind of error')
    }
  }
  return (
    <StyledOuterContainer>
      <StyledContainer>
        <StyledFullPanel>
          <StyledLogoWrapper>
            <StyledLogo />
          </StyledLogoWrapper>
          <StyledTextWrapper>
            <StyledText>Let's create your Zing!</StyledText>
          </StyledTextWrapper>
          <StyledQuestionsWrapper>
            <StyledQuestionWrapper
              style={{ paddingBottom: q1Error === '' ? '1.4rem' : '0rem' }}
            >
              <StyledQuestion
                error={q1Error}
                fullWidth={true}
                question={q1}
                value={groupName}
                setAnswer={(arg: string) => setGroupName(arg)}
                placeholder={placeholder}
                isNumber={false}
                inputStyle={q1TextStyle}
              />
            </StyledQuestionWrapper>
            <StyledQuestionWrapper
              style={{ paddingBottom: q2Error === '' ? '1.4rem' : '0rem' }}
            >
              <StyledQuestion
                fullWidth={true}
                error={q2Error}
                question={q2}
                value={totalPeople}
                setAnswer={(arg: string) => setTotalPeople(arg)}
                placeholder={placeholder}
                isNumber={true}
                inputStyle={q2TextStyle}
              />
            </StyledQuestionWrapper>
            <StyledQuestionWrapper
              style={{ paddingBottom: q3Error === '' ? '1.4rem' : '0rem' }}
            >
              <StyledQuestion
                fullWidth={true}
                error={q3Error}
                question={q3}
                value={studentsPerGroup}
                setAnswer={(arg: string) => setStudentsPerGroup(arg)}
                placeholder={placeholder}
                isNumber={true}
                inputStyle={q3TextStyle}
              />
            </StyledQuestionWrapper>
            <SubmitButton onClick={handleSubmit} />
          </StyledQuestionsWrapper>
          {/* <p>{groupName}</p>
          <p>{totalPeople}</p>
          <p>{studentsPerGroup}</p> */}
        </StyledFullPanel>
      </StyledContainer>
    </StyledOuterContainer>
  )
}
