import { addStudentSurveyResponse } from '../student/functions'
require('dotenv').config({ path: '../.env' })

const selectCollege = () => {
  const colleges = [
    'Engineering',
    'A&S',
    'CALS',
    'Dyson',
    'ILR',
    'HumEc',
    'AAP',
    'Hotel Admin',
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

const selectClasses = (numClasses = 3) => {
  const classes = [
    'CS 1110',
    'CS 2110',
    'INFO 1300',
    'ECON 1110',
    'MATH 1920',
    'PHYS 2213',
  ]
  return getRandomSample(classes, numClasses)
}

const addTestStudents = async () => {
  const alphabet = Array.from('abcdefghijklmnopqrstuvwxyz')
  await Promise.all(
    alphabet.map((a) =>
      addStudentSurveyResponse(
        a,
        `${a}@cornell.edu`,
        selectCollege(),
        selectYear(),
        selectClasses()
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

addTestStudents()

module.exports = addTestStudents
