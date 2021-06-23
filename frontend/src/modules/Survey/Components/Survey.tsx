import React, { useState } from 'react'

import { StyledContainer1, StyledContainer2 } from 'Survey/Styles/Survey.style'
import { StepTemplate } from 'Survey/Components/StepTemplate'
import { StepBegin } from 'Survey/Components/StepBegin'
import { StepCourse } from 'Survey/Components/StepCourse'
import { StepYear } from 'Survey/Components/StepYear'
import { StepRadio } from 'Survey/Components/StepRadio'
import { StepFinal } from 'Survey/Components/StepFinal'
import {
  getLetter,
  getOldestGradYear,
  getYoungestGradYear,
  sendSurveyData,
  surveyData,
} from 'Survey/Components/FuncsAndConsts/SurveyFunctions'
import { Question } from 'Survey/Types/Questions'

export const Survey = () => {
  const [showError, setShowError] = useState(false)
  const [currStep, setCurrStep] = useState(0)
  // If there are custom questions the below will be a network call perhaps
  const questions: Question[] = require('./FuncsAndConsts/Questions.json')
  const totalSteps = questions.length + 1 // One special question

  // Form answer props
  const [nameAnswer, setNameAnswer] = useState('')
  const [emailAnswer, setEmailAnswer] = useState('')
  const [courseList, setCourseList] = useState<string[]>([])
  const [gradAnswer, setGradAnswer] = useState('')
  const [collegeAnswer, setCollegeAnswer] = useState('')
  const [locationAnswer, setLocationAnswer] = useState('')
  const [groupPrefAnswer, setGroupPrefAnswer] = useState('')
  const [studyTimeAnswer, setStudyTimeAnswer] = useState('')

  // last step's Next button handles sending data
  function finalNext() {
    const surveyDataObj: surveyData = {
      courseIds: courseList,
      fullName: nameAnswer,
      studentId: 'a1', // ??? TODO ???
      graduation: getLetter(gradAnswer, true),
      college: getLetter(collegeAnswer, false),
      remote: getLetter(locationAnswer, false),
      mode: getLetter(groupPrefAnswer, false),
      time: getLetter(studyTimeAnswer, false),
    }
    sendSurveyData(surveyDataObj)
    setCurrStep(currStep + 1)
  }

  const isStepValid =
    currStep === 1 ? courseList.length > 0 :
    currStep === 2 ? collegeAnswer !== '' :
    currStep === 3 ? Number(gradAnswer) <= getYoungestGradYear()
                     && Number(gradAnswer) >= getOldestGradYear() :
    currStep === 4 ? locationAnswer !== '' :
    currStep === 5 ? groupPrefAnswer !== '' :
    currStep === 6 ? studyTimeAnswer !== '' : true

  return currStep === 0 ? (
    <StyledContainer1>
      <StepBegin
        name={nameAnswer}
        email={emailAnswer}
        setName={(arg: string) => setNameAnswer(arg)}
        setEmail={(arg: string) => setEmailAnswer(arg)}
        gotoNextStep={() => setCurrStep((currStep) => currStep + 1)}
      />
    </StyledContainer1>
  ) : currStep === 7 ? (
    <StyledContainer2>
      <StepFinal />
      {/* FOR DEBUGGING NETWORKING + ANSWERS */}
      <p>{getLetter(gradAnswer, true)}</p>
      <p>{getLetter(collegeAnswer, false)}</p>
      <p>{getLetter(locationAnswer, false)}</p>
      <p>{getLetter(groupPrefAnswer, false)}</p>
      <p>{getLetter(studyTimeAnswer, false)}</p>
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
            currentAnswer={collegeAnswer}
            question={questions[0]}
            setAnswer={setCollegeAnswer}
            key={String(currStep)}
          />
        ) : currStep === 3 ? (
          // <StepYear
          //   showError={showError}
          //   currentAnswer={gradAnswer}
          //   setAnswer={setGradAnswer}
          // />
          null
        ) : currStep === 4 ? (
          <StepRadio
            showError={showError}
            currentAnswer={locationAnswer}
            question={questions[1]}
            setAnswer={setLocationAnswer}
            key={String(currStep)}
          />
        ) : currStep === 5 ? (
          <StepRadio
            showError={showError}
            currentAnswer={groupPrefAnswer}
            question={questions[2]}
            setAnswer={setGroupPrefAnswer}
            key={String(currStep)}
          />
        ) : currStep === 6 ? (
          <StepRadio
            showError={showError}
            currentAnswer={studyTimeAnswer}
            question={questions[3]}
            setAnswer={setStudyTimeAnswer}
            key={String(currStep)}
          />
        ) : null}
      </StepTemplate>
    </StyledContainer2>
  )
}
