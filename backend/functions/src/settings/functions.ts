import { db } from '../config'
import { Semester } from '../types'

const semesterRef = db.collection('utils').doc('semester')

export const getCurrentSemester = async (): Promise<string> => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.currentSemester
}

export const setCurrentSemester = async (sem: string) => {
  const semData = (await semesterRef.get()).data() as Semester
  return semesterRef.set({
    ...semData,
    currentSemester: sem,
  })
}

export const getAllSemesters = async () => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.allSemesters
}

export const getSurveyStatus = async () => {
  const semData = (await semesterRef.get()).data() as Semester
  return semData.surveyOpen
}

export const setSurveyStatus = async (status: boolean) => {
  const semData = (await semesterRef.get()).data() as Semester
  return semesterRef.set({ ...semData, surveyOpen: status })
}
