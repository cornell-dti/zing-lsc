import axios from 'axios'
import { addStudentSurveyResponse } from '../student/functions'
require('dotenv').config({ path: '../.env' })

const selectCollege = () => {
  const colleges = [
    'CALS',
    'AAP',
    'A&S',
    'BUAG',
    'SHA',
    'ENG',
    'CIS',
    'CHE',
    'ILR',
    'SCE',
    'SPP',
  ]
  return colleges[Math.floor(Math.random() * colleges.length)]
}

const selectYear = () => {
  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad']
  return years[Math.floor(Math.random() * years.length)]
}

const getRandomSample = (arr: string[], n: number) => {
  // taken from https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
  const result = new Array(n)
  let len = arr.length
  const taken = new Array(len)
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available')
  while (n--) {
    const x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

const generateRandomString = (length: number) => {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomClasses = async (count: number) => {
  const subjects = [
    'CS',
    'INFO',
    'ECON',
    'MATH',
    'PHYS',
    'PHIL',
    'MUSIC',
    'LING',
  ]

  const possibleCourses = await Promise.all(
    subjects.map(async (subject) => {
      const res = await axios.get(
        `https://classes.cornell.edu/api/2.0/search/classes.json?roster=SP23&subject=${subject}`
      )
      return res.data.data.classes.map(
        (cls: { subject: string; catalogNbr: string }) => {
          return `${cls.subject} ${cls.catalogNbr}`
        }
      )
    })
  )
  const flattenedCourses = possibleCourses.flat()
  console.log('course count:', flattenedCourses.length)
  return getRandomSample(flattenedCourses, count)
}

const selectClasses = (numClasses = 3, classes: string[]) => {
  return getRandomSample(classes, numClasses)
}

const generateRandomCUEmail = () => {
  const randomString = generateRandomString(3)
  const randomNumberCount = generateRandomNumber(1, 3)
  let randomNumber = ''
  for (let i = 0; i < randomNumberCount; i++) {
    randomNumber += generateRandomNumber(0, 9).toString()
  }
  return `${randomString}${randomNumber}@cornell.edu`
}

// function takes all the allowed users
const addTestStudents = async (numStudents: number, numCourses: number) => {
  const users = Array.from({ length: numStudents }, () =>
    generateRandomCUEmail()
  )

  const classes: string[] = [
    'CS 1110',
    'CS 2110',
    'INFO 1300',
    'ECON 1110',
    'MATH 1920',
    'PHYS 2213',
  ].concat(...(await getRandomClasses(numCourses)))

  await Promise.all(
    users.map((email) =>
      addStudentSurveyResponse(
        email.substring(0, email.indexOf('@')),
        email,
        selectCollege(),
        selectYear(),
        selectClasses(3, classes),
        true
      )
        .then(() => {
          console.log('added successfully!')
        })
        .catch((err) => {
          console.log('error adding student', err)
        })
    )
  )
}

addTestStudents(1000, 100)

module.exports = addTestStudents
