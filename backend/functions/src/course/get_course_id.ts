import axios from 'axios'
import { logger } from 'firebase-functions'

class MissingCourseError extends Error {
  courseCatalogName: string
  roster: string

  constructor(courseCatalogName: string, roster: string) {
    super(`Could not find course ${courseCatalogName} in roster ${roster}`)
    this.name = this.constructor.name
    this.courseCatalogName = courseCatalogName
    this.roster = roster
  }
}

function constructUrl(courseCatalogName: string, roster: string) {
  let url = 'https://classes.cornell.edu/api/2.0/search/classes.json?'
  const [subject, number] = courseCatalogName.split(' ')
  const numberBracket = Math.floor(Number(number) / 1000) * 1000

  url += `roster=${roster}&`
  url += `subject=${subject}&`
  url += `classLevels[]=${numberBracket}`

  return url
}

async function mapCatalogNameToCourseId(
  courseCatalogName: string,
  roster: string
): Promise<string> {
  const validCourseRe = /^[A-Z]{2,7} \d{4}$/
  if (!validCourseRe.test(courseCatalogName)) {
    logger.error(`Invalid course catalog name: ${courseCatalogName}`) // Log as error because client-side validation should have caught this!
    throw new MissingCourseError(courseCatalogName, roster) // Invalid course names never exist
  }

  const url = constructUrl(courseCatalogName, roster)
  const response = await axios.get(url).catch((error) => {
    if (error.response.status === 404) {
      throw new MissingCourseError(courseCatalogName, roster)
    } else {
      throw error
    }
  })

  //first .data just gets the response data from the request, while the second
  // .data gets the "data" field in the API response.
  const data = response.data.data
  const classData = data.classes.find(
    (courseObject: { subject: string; catalogNbr: string }) =>
      `${courseObject.subject} ${courseObject.catalogNbr}` === courseCatalogName
  )

  if (!classData) {
    throw new MissingCourseError(courseCatalogName, roster)
  }

  return `${roster}-${classData.crseId}`
}

export { mapCatalogNameToCourseId, MissingCourseError }
