export interface Question {
  question: string
  questionId: string
  answers: {
    [key: string]: string
  }
}
