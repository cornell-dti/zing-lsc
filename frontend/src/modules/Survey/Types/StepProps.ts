import { Question } from "./Questions";

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
  courses: string[]
  setCourses: (arg: string[]) => void
}
