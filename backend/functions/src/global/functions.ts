import { db } from '../config'
import { Semester } from '../types'

const semesterRef = db.collection('utils').doc('semester')

export const getCurrentSemester = async (): Promise<String> => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.currentSemester
}

export const setCurrentSemester = async (sem: String) => {
  return semesterRef.set({ currentSemester: sem, surveyOpen: false })
}

export const getAllSemesters = async () => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.allSemesters
}

export const getSurveyStatus = async () => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.surveyOpen
}

export const setSurveyStatus = async (status: Boolean) => {
  return semesterRef.set({ surveyOpen: status })
}
