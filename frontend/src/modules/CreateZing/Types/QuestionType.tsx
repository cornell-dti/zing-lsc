import React from 'react'

export type QuestionProps = {
  fullWidth: boolean // should the question take up the full container?
  error: string // by default should be '' and if it is '' then no error
  question: string // the actual question as a string
  setAnswer: (arg: string) => void // sets answer state in parent component
  isNumber: boolean // true if the question is asking for a numerical answer
  placeholder: string // placeholder
  value: string //state value
  inputStyle: { [key in string]: any } // style for text
}
