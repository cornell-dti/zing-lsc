import axios from 'axios'
import { API_ROOT, STUDENT_API } from '@core/Constants'

export type SurveyData = {
  courseCatalogNames: string[]
  name: string
  email: string
  [key: string]: any
}

export async function sendSurveyData(data: SurveyData) {
  axios.post(`${API_ROOT}${STUDENT_API}/survey`, data).then(
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
