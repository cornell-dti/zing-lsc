import React, { useState } from 'react'

import { StyledContainer1, StyledContainer2 } from 'Survey/Styles/Survey.style'
import { StepTemplate } from 'Survey/Components/StepTemplate'
import { StepBegin } from 'Survey/Components/StepBegin'
import { StepCourse } from 'Survey/Components/StepCourse'
import { StepRadio } from 'Survey/Components/StepRadio'
import { StepFinal } from 'Survey/Components/StepFinal'
import {
  sendSurveyData,
  SurveyData,
} from 'Survey/Components/FuncsAndConsts/SurveyFunctions'
import { Question } from 'Survey/Types/Questions'

export const Survey = () => {
  const [showError, setShowError] = useState(false)
  const [currStep, setCurrStep] = useState(0)
  // If there are custom questions the below will be a network call perhaps
  const questions: Question[] = require('./FuncsAndConsts/Questions.json')
  const numSpecialQuestions = 1 // Course list
  const totalSteps = questions.length + numSpecialQuestions

  // Form answer props
  const [nameAnswer, setNameAnswer] = useState('')
  const [emailAnswer, setEmailAnswer] = useState('')
  const [courseList, setCourseList] = useState<string[]>([])
  const [answers, setAnswers] = useState(Array<string>(questions.length).fill('')) // Will be in order of Qs

  const changeAnswer = (i: number, v: string) => {
    setAnswers(answers.map((value, index) => index === i ? v : value))
  }

  // last step's Next button handles sending data
  function finalNext() {
    const mcData = Object.fromEntries(questions.map((question, index) => [question.questionId, answers[index]]))
    const surveyData: SurveyData = {
      courseCatalogNames: courseList,
      name: nameAnswer,
      email: emailAnswer,
      ...mcData
    }
    console.log('Finished survey', surveyData)
    sendSurveyData(surveyData)
    setCurrStep(currStep + 1)
  }

  const multipleChoiceIndex = currStep - numSpecialQuestions - 1
  const isStepValid =
    currStep === 1 ? courseList.length > 0 : answers[multipleChoiceIndex] !== ''

  return currStep === 0 ? ( // Form landing
    <StyledContainer1>
      <StepBegin
        name={nameAnswer}
        email={emailAnswer}
        setName={(arg: string) => setNameAnswer(arg)}
        setEmail={(arg: string) => setEmailAnswer(arg)}
        gotoNextStep={() => setCurrStep((currStep) => currStep + 1)}
      />
    </StyledContainer1>
  ) : currStep === totalSteps + 1 ? ( // Form confirmation
    <StyledContainer2>
      <StepFinal />
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
        {currStep === 1 ? ( // Course selection
          <StepCourse
            courses={courseList}
            setCourses={setCourseList}
          />
        ) : ( // General multiple-choice
          <StepRadio
            showError={showError}
            currentAnswer={answers[multipleChoiceIndex]}
            question={questions[multipleChoiceIndex]}
            setAnswer={(arg) => changeAnswer(multipleChoiceIndex, arg)}
            key={String(currStep)}
          />
        )}
      </StepTemplate>
    </StyledContainer2>
  )
}
