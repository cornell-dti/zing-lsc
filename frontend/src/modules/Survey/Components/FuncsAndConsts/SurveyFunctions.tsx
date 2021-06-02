import { domainToASCII } from 'node:url'
import React from 'react'
const axios = require('axios')

export type surveyData = {
  courseId: string
  fullName: string
  studentId: string
  identity: string
  pronoun: string
  graduation: string
  college: string
  remote: string
  mode: string
  time: string
  start: string
}

export function getLetter(ans: string, isDate: boolean) {
  if (!isDate) {
    return String.fromCharCode(Number(ans) + 64).toLowerCase()
  }
  const oy = getOldestGradYear()
  switch (Number(ans)) {
    case oy:
      return 'a'
    case oy + 1:
      return 'b'
    case oy + 2:
      return 'c'
    case oy + 3:
      return 'd'
    case oy + 4:
      return 'e'
    default:
      alert('Form validation is broken; somehow, user is entering a weird date')
      return ''
  }
}

export async function sendSurveyData(data: surveyData) {
  axios
    .post('https://us-central1-zing-backend.cloudfunctions.net/newSurvey', data)
    .then(
      (response: any) => {
        console.log(response)
      },
      (error: any) => {
        console.log(error)
      }
    )
}

export function getYoungestGradYear() {
  const now: Date = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  if (month > 4) {
    return year + 5
  } else {
    return year + 4
  }
}

export function getOldestGradYear() {
  const now: Date = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  if (month > 4) {
    return year + 1
  } else {
    return year
  }
}
