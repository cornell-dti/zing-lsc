import React, { useState } from 'react'

import { StyledContainer1, StyledContainer2 } from 'Survey/Styles/Survey.style'
import { StepTemplate } from 'Survey/Components/StepTemplate'
import { Step0 } from 'Survey/Components/Step0'
import { StepCourse } from 'Survey/Components/StepCourse'
import { Step3 } from 'Survey/Components/Step3'
import { StepRadio } from 'Survey/Components/StepRadio'
import { StepFinal } from 'Survey/Components/StepFinal'
import {
  getLetter,
  getOldestGradYear,
  getYoungestGradYear,
  sendSurveyData,
  surveyData,
} from 'Survey/Components/FuncsAndConsts/SurveyFunctions'

export const Survey = () => {
  const [showError, setShowError] = useState(false)
  const [currStep, setCurrStep] = useState(0)
  const questions = require('./FuncsAndConsts/Questions.json')
  const totalSteps = 9

  // state props
  // step 0
  const [nameAnswer, setNameAnswer] = useState('')
  const [emailAnswer, setEmailAnswer] = useState('')

  // step 1
  const [courseList, setCourseList] = useState<string[]>([])

  // step 2
  const [ethnicityAnswer, setEthnicityAnswer] = useState('')

  // step 3
  const [pronounAnswer, setPronounAnswer] = useState('')

  // step 4
  const [gradAnswer, setGradAnswer] = useState('')

  // step 5
  const [collegeAnswer, setCollegeAnswer] = useState('')

  // step 6
  const [locationAnswer, setLocationAnswer] = useState('')

  // step 7
  const [groupPrefAnswer, setGroupPrefAnswer] = useState('')

  // step 8
  const [studyTimeAnswer, setStudyTimeAnswer] = useState('')

  // step 9
  const [assignmentAnswer, setAssignmentAnswer] = useState('')

  // last step's Next button handles sending data
  function finalNext() {
    const surveyDataObj: surveyData = {
      courseId: 'zf101-2021sp', // hard coded
      fullName: nameAnswer, // hard coded
      studentId: 'a1',
      identity: getLetter(ethnicityAnswer, false),
      pronoun: getLetter(pronounAnswer, false),
      graduation: getLetter(gradAnswer, true),
      college: getLetter(collegeAnswer, false),
      remote: getLetter(locationAnswer, false),
      mode: getLetter(groupPrefAnswer, false),
      time: getLetter(studyTimeAnswer, false),
      start: getLetter(assignmentAnswer, false),
    }
    sendSurveyData(surveyDataObj)
    setCurrStep(currStep + 1)
  }

  const isStepValid =
    currStep === 1 ? courseList.length > 0 :
    currStep === 2 ? ethnicityAnswer !== '' :
    currStep === 3 ? pronounAnswer !== '' :
    currStep === 4 ? Number(gradAnswer) <= getYoungestGradYear()
                     && Number(gradAnswer) >= getOldestGradYear() :
    currStep === 5 ? collegeAnswer !== '' :
    currStep === 6 ? locationAnswer !== '' :
    currStep === 8 ? studyTimeAnswer !== '' :
    currStep === 9 ? assignmentAnswer !== '' : true

  return currStep === 0 ? (
    <StyledContainer1>
      <Step0
        name={nameAnswer}
        email={emailAnswer}
        setName={(arg: string) => setNameAnswer(arg)}
        setEmail={(arg: string) => setEmailAnswer(arg)}
        gotoNextStep={() => setCurrStep((currStep) => currStep + 1)}
      />
    </StyledContainer1>
  ) : currStep === 10 ? (
    <StyledContainer2>
      <StepFinal />
      {/* FOR DEBUGGING NETWORKING + ANSWERS */}
      <p>{getLetter(ethnicityAnswer, false)}</p>
      <p>{getLetter(pronounAnswer, false)}</p>
      <p>{getLetter(gradAnswer, true)}</p>
      <p>{getLetter(collegeAnswer, false)}</p>
      <p>{getLetter(locationAnswer, false)}</p>
      <p>{getLetter(groupPrefAnswer, false)}</p>
      <p>{getLetter(studyTimeAnswer, false)}</p>
      <p>{getLetter(assignmentAnswer, false)}</p>
    </StyledContainer2>
  ) : (
    <StyledContainer2>
      <StepTemplate
        setShowError={setShowError}
        isStepValid={isStepValid}
        stepNumber={currStep}
        totalSteps={totalSteps}
        gotoPrevStep={() => setCurrStep((currStep) => currStep - 1)}
        gotoNextStep={currStep === totalSteps ? finalNext : () => setCurrStep((currStep) => currStep + 1)}
      >
        {currStep === 1 ? (
          <StepCourse
            courses={courseList}
            setCourses={setCourseList}
          />
        ) : currStep === 2 ? (
          <StepRadio
            showError={showError}
            questionList={questions.step1}
            setAnswer={setEthnicityAnswer}
            key={String(currStep)}
            currentAnswer={ethnicityAnswer}
          />
        ) : currStep === 3 ? (
          <StepRadio
            showError={showError}
            currentAnswer={pronounAnswer}
            questionList={questions.step2}
            setAnswer={setPronounAnswer}
            key={String(currStep)}
          />
        ) : currStep === 4 ? (
          <Step3
            showError={showError}
            currentAnswer={gradAnswer}
            setAnswer={setGradAnswer}
          />
        ) : currStep === 5 ? (
          <StepRadio
            showError={showError}
            currentAnswer={collegeAnswer}
            questionList={questions.step4}
            setAnswer={setCollegeAnswer}
            key={String(currStep)}
          />
        ) : currStep === 6 ? (
          <StepRadio
            showError={showError}
            currentAnswer={locationAnswer}
            questionList={questions.step5}
            setAnswer={setLocationAnswer}
            key={String(currStep)}
          />
        ) : currStep === 7 ? (
          <StepRadio
            showError={showError}
            currentAnswer={groupPrefAnswer}
            questionList={questions.step6}
            setAnswer={setGroupPrefAnswer}
            key={String(currStep)}
          />
        ) : currStep === 8 ? (
          <StepRadio
            showError={showError}
            currentAnswer={studyTimeAnswer}
            questionList={questions.step7}
            setAnswer={setStudyTimeAnswer}
            key={String(currStep)}
          />
        ) : currStep === 9 ? (
          <StepRadio
            showError={showError}
            currentAnswer={assignmentAnswer}
            questionList={questions.step8}
            setAnswer={setAssignmentAnswer}
            key={String(currStep)}
          />
        ) : null}
      </StepTemplate>
    </StyledContainer2>
  )
}
