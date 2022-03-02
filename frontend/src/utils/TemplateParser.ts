// template parser for the .template email files

type EmailTemplate = {
  subject: string
  body: string
}

async function readFile(filename: string): Promise<string> {
  return fetch(filename).then((r) => r.text())
}

let err_msg = 'Mismatch between number of tags and the data provided'

function replaceTemplateTagsUtil(
  text: string,
  startIndex: number,
  data: string[],
  accum: string
): string {
  if (startIndex >= text.length) {
    if (data) throw new Error(err_msg)
    return accum
  }
  const replaceIndex = text.indexOf('<data>', startIndex)
  if (replaceIndex === -1) return accum + text.slice(startIndex)
  const dataPoint = data.shift()

  const mid = text.slice(startIndex, replaceIndex)

  if (!dataPoint) throw new Error(err_msg)
  return replaceTemplateTagsUtil(
    text,
    replaceIndex + 6,
    data,
    accum + mid + dataPoint
  )
}

function replaceTemplateTags(text: string, data: string[]) {
  return replaceTemplateTagsUtil(text, 0, data, '')
}

function extractBetweenTag(tagName: string, text: string) {
  const openTag = `<${tagName}>`,
    closeTag = `</${tagName}>`
  const firstIndex = text.indexOf(openTag)
  const lastIndex = text.indexOf(closeTag)

  if (firstIndex === -1 || lastIndex === -1) {
    throw new Error(`Invalid text prodived -- could not parse ${tagName}.`)
  }

  return text.substring(firstIndex + tagName.length + 2, lastIndex).trim()
}

export default async function parseTemplate(
  fileName: string,
  data: string[]
): Promise<EmailTemplate> {
  const fileText = await readFile(fileName)
  const subject = extractBetweenTag('subject', fileText)
  const body = replaceTemplateTags(extractBetweenTag('body', fileText), data)

  return {
    subject,
    body,
  }
}
