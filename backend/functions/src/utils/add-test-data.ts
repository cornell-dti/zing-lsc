import { addStudentSurveyResponse } from '../student/functions'
require('dotenv').config({ path: '../.env' })

const selectCollege = () => {
  const colleges = [
    'CALS',
    'AAP',
    'A&S',
    'Engineering',
    'HumEc',
    'Dyson',
    'Nolan',
    'ILR',
    'SCE',
    'Grad School',
    'Brooks',
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

// function takes all the allowed users
const addTestStudents = async () => {
  const users = [
    'mml267@cornell.edu',
    'cl859@cornell.edu',
    'bt283@cornell.edu',
    'cww72@cornell.edu',
    'jjw255@cornell.edu',
    'pak226@cornell.edu',
    'ml953@cornell.edu',
    'jk2338@cornell.edu',
    'rg779@cornell.edu',
  ]

  await Promise.all(
    users.map((email) =>
      addStudentSurveyResponse(
        email.substring(0, email.indexOf('@')),
        email,
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
