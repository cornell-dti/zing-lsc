import axios from 'axios'

function isNumeric(n: string) {
  return !isNaN(parseFloat(n))
}

function getCourseParams(courseCatalogName: any) {
  let i = 0
  while (i < courseCatalogName.length && !isNumeric(courseCatalogName[i])) {
    i += 1
  }

  if (i == courseCatalogName.length || courseCatalogName.length - i !== 4)
    throw new Error('Invalid course input provided')

  return [
    courseCatalogName.slice(0, i),
    Math.floor(courseCatalogName.slice(i) / 1000) * 1000,
  ]
}

function constructUrl(courseCatalogName: any, roster: any) {
  let url = 'https://classes.cornell.edu/api/2.0/search/classes.json?'
  const [subject, numberBracket] = getCourseParams(courseCatalogName)

  url += `roster=${roster}&`
  url += `subject=${subject}&`
  url += `classLevels[]=${numberBracket}`

  return url
}

async function getCourseId(
  courseCatalogNameRaw: string,
  roster: string
): Promise<string> {
  const courseCatalogName = courseCatalogNameRaw.replace(/\s+/g, '')
  const url = constructUrl(courseCatalogName, roster)
  const response = await axios.get(url)

  //first .data just gets the response data from the request, while the second
  // .data gets the "data" field in the API response.
  const data = response.data.data
  const classData = data.classes.find(
    (courseObject: { subject: any; catalogNbr: any }) =>
      courseObject.subject + courseObject.catalogNbr === courseCatalogName
  )

  if (!classData)
    throw new Error(`Could not find course data for class ${courseCatalogName}`)

  return classData.crseId.toString()
}

export default getCourseId
