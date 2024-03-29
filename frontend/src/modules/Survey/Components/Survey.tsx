import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Question } from '@core/Types'
import { API_ROOT, STUDENT_API, SETTINGS_API } from '@core/Constants'
import {
  StyledContainer1 as SplashBackground,
  StyledContainer2 as QuestionBackground,
} from 'Survey/Styles/Survey.style'
import { StepTemplate } from 'Survey/Components/StepTemplate'
import { StepBegin } from 'Survey/Components/StepBegin'
import { StepCourse } from 'Survey/Components/StepCourse'
import { StepRadio } from 'Survey/Components/StepRadio'
import { StepFinal } from 'Survey/Components/StepFinal'
import { StepFail } from 'Survey/Components/StepFail'
import { SurveyData } from 'Survey/Components/FuncsAndConsts/SurveyFunctions'
import { SurveySubmissionResponse } from 'Survey/Types'
import survey from '@core/Questions/Questions.json'
import { useCourseValue } from '@context/CourseContext'

export const Survey = () => {
  const [currStep, setCurrStep] = useState(1)
  const [currSurveyState, setCurrSurveyState] = useState<boolean>(true)

  function getCurrSurveyState() {
    axios.get(`${API_ROOT}/global/semester/survey`).then((req) => {
      setCurrSurveyState(req.data)
      console.log(req.data)
    })
  }

  useEffect(() => {
    getCurrSurveyState()
    console.log(`Survey Status is currently ${currSurveyState}`)
  }, [])

  // Final step data
  const [surveySubmissionResponse, setSurveySubmissionResponse] = useState<
    SurveySubmissionResponse | undefined
  >()
  const [surveyError, setSurveyError] = useState<string | null>(null)

  // For the progress spinner on the submission button
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false)

  // If there are custom questions the below will be a network call perhaps
  const questions: Question[] = survey.map((question) => {
    var obj: { [key: string]: string } = {}
    Object.entries(question.answers).forEach((answer) => {
      if (answer[0] && answer[1]) {
        obj[answer[0]] = answer[1]
      }
    })
    return {
      question: question.question,
      questionId: question.questionId,
      answers: obj,
    }
  })

  const numSpecialQuestions = 1 // Course list
  const totalSteps = questions.length + numSpecialQuestions + 1

  // Form answer props
  const [nameAnswer, setNameAnswer] = useState('')
  const [emailAnswer, setEmailAnswer] = useState('')
  const [courseList, setCourseList] = useState<string[]>([])
  const [answers, setAnswers] = useState(
    Array<string>(questions.length).fill('')
  ) // Will be in order of Qs

  const changeAnswer = (i: number, v: string) => {
    setAnswers(answers.map((value, index) => (index === i ? v : value)))
  }

  // last step's Next button handles sending data
  function finalNext() {
    setIsSubmittingSurvey(true)
    const mcData = Object.fromEntries(
      questions.map((question, index) => [question.questionId, answers[index]])
    )
    const surveyData: SurveyData = {
      courseCatalogNames: courseList,
      name: nameAnswer,
      email: emailAnswer,
      surveySubmittable: currSurveyState,
      ...mcData,
    }
    console.log('Finished survey', surveyData)
    axios.post(`${API_ROOT}${STUDENT_API}/survey`, surveyData).then(
      (response: any) => {
        setIsSubmittingSurvey(false)
        console.log(response)
        setSurveySubmissionResponse(response.data.data)
        setCurrStep(currStep + 1)
      },
      (error: any) => {
        setIsSubmittingSurvey(false)
        console.log(error)
        setSurveyError(error.response.data.message)
        setCurrStep(currStep + 1)
      }
    )
  }

  const multipleChoiceIndex = currStep - numSpecialQuestions - 2
  const validCourseRe = /^[A-Z]{2,7} \d{4}$/
  const isStepValid =
    currStep === 2
      ? courseList.length > 0 && courseList.every((c) => validCourseRe.test(c))
      : answers[multipleChoiceIndex] !== ''

  return currSurveyState ? (
    currStep === 1 ? ( // Form landing
      <SplashBackground>
        <StepBegin
          name={nameAnswer}
          email={emailAnswer}
          setName={(arg: string) => setNameAnswer(arg)}
          setEmail={(arg: string) => setEmailAnswer(arg)}
          gotoNextStep={() => setCurrStep((currStep) => currStep + 1)}
        />
      </SplashBackground>
    ) : currStep === totalSteps + 1 ? (
      // Form confirmation
      <QuestionBackground>
        <StepFinal
          success={surveyError === null}
          submissionResponse={surveySubmissionResponse!}
          errorMsg={surveyError != null ? surveyError : ''}
        />
      </QuestionBackground>
    ) : (
      <QuestionBackground>
        <StepTemplate
          isStepValid={isStepValid}
          isSubmittingSurvey={isSubmittingSurvey}
          stepNumber={currStep}
          totalSteps={totalSteps}
          gotoPrevStep={() => setCurrStep((currStep) => currStep - 1)}
          gotoNextStep={
            currStep === totalSteps && currSurveyState
              ? finalNext
              : () => setCurrStep((currStep) => currStep + 1)
          }
        >
          {currStep === 2 ? ( // Course selection
            <StepCourse
              validCourseRe={validCourseRe}
              courses={courseList}
              setCourses={setCourseList}
            />
          ) : (
            // General multiple-choice
            <StepRadio
              currentAnswer={answers[multipleChoiceIndex]}
              question={questions[multipleChoiceIndex]}
              setAnswer={(arg) => changeAnswer(multipleChoiceIndex, arg)}
              key={String(currStep)}
            />
          )}
        </StepTemplate>
      </QuestionBackground>
    )
  ) : (
    <QuestionBackground>
      <StepFail></StepFail>
    </QuestionBackground>
  )
}
