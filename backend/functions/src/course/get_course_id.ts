import axios from 'axios'

function constructUrl(courseCatalogName: string, roster: string) {
  let url = 'https://classes.cornell.edu/api/2.0/search/classes.json?'
  const [subject, number] = courseCatalogName.split(' ')
  const numberBracket = Math.floor(Number(number) / 1000) * 1000

  url += `roster=${roster}&`
  url += `subject=${subject}&`
  url += `classLevels[]=${numberBracket}`

  return url
}

async function getCourseId(
  courseCatalogName: string,
  roster: string
): Promise<string> {
  const validCourseRe = /^[A-Z]{2,7} \d{4}$/
  if (!validCourseRe.test(courseCatalogName)) {
    throw new Error(`Invalid course catalog name: ${courseCatalogName}`)
  }

  const url = constructUrl(courseCatalogName, roster)
  const response = await axios.get(url)

  //first .data just gets the response data from the request, while the second
  // .data gets the "data" field in the API response.
  const data = response.data.data
  const classData = data.classes.find(
    (courseObject: { subject: string; catalogNbr: string }) =>
      `${courseObject.subject} ${courseObject.catalogNbr}` === courseCatalogName
  )

  if (!classData) {
    throw new Error(`Could not find course data for class ${courseCatalogName}`)
  }

  return classData.crseId.toString()
}

export default getCourseId
