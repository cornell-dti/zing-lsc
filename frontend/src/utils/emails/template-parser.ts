// A naive template parser for the .template email files
import { readFileSync } from 'fs'

type EmailTemplate = {
  subject: string
  body: string
}

function readFile(filename: string) {
  return readFileSync(`./bodies/${filename}`, 'utf-8')
}

function replaceTemplateTagsUtil(
  text: string,
  startIndex: number,
  data: string[],
  accum: string
): string {
  if (startIndex >= text.length) {
    if (data)
      throw new Error('Mismatch between number of tags and the data provided')
    return accum
  }

  const replaceIndex = text.indexOf('<data>', startIndex)
  if (replaceIndex === -1) return accum + text.slice(startIndex)
  const dataPoint = data.shift()

  const mid = text.slice(startIndex, replaceIndex)

  if (!dataPoint)
    throw new Error('Mismatch between number of tags and the data provided')
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
    throw new Error(`Invalid text provided -- could not parse ${tagName}.`)
  }

  return text.substring(firstIndex + tagName.length + 2, lastIndex).trim()
}

export default function parseTemplate(
  fileName: string,
  data: string[]
): EmailTemplate {
  const fileText = readFile(fileName)
  const subject = extractBetweenTag('subject', fileText)
  const body = replaceTemplateTags(extractBetweenTag('body', fileText), data)

  return {
    subject,
    body,
  }
}
