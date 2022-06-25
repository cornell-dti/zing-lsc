import { Question } from '@core/Types'

export interface SurveySubmissionResponse {
  added: string[]
  failed: string[]
  roster: string
}

export interface StepTemplateProps {
  gotoPrevStep: () => void
  gotoNextStep: () => void
  stepNumber: number
  totalSteps: number
  isStepValid: boolean
  setShowError: (b: boolean) => void
}

export interface StepProps {
  question: Question
  setAnswer: (arg: string) => void
  key?: string
  currentAnswer: string
  showError: boolean
}

export interface StepBeginProps {
  setName: (arg: string) => void
  setEmail: (arg: string) => void
  name: string
  email: string
  gotoNextStep: () => void
}

export interface StepCourseProps {
  validCourseRe: RegExp
  courses: string[]
  setCourses: (arg: string[]) => void
}

export interface StepFinalProps {
  success: boolean
  submissionResponse: SurveySubmissionResponse
  errorMsg?: string
}

export interface SuccessIcon {
  className?: string
  src: string
}
