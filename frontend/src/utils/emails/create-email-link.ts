import { assert } from 'console'
import parse from './template-parser'

function constructMailtoUrl(
  receivers: string[],
  subject: string,
  body: string
): string {
  let url = 'mailto:'
  url += receivers.join(',')
  url += '?subject=' + subject
  url += '&body=' + encodeURI(body)
  return url
}

type ValidTemplates = 'matched' | 'no-match-1' | 'no-match-2'
export default function getMailUrl(
  receivers: string[],
  template: ValidTemplates,
  data: string[]
) {
  if (template === 'matched') {
    assert(data.length === 0)
    let { subject, body } = parse('matching.template', data)
    return constructMailtoUrl(receivers, subject, body)
  } else if (template === 'no-match-1') {
    assert(data.length === 2) // [student name, class]
    let { subject, body } = parse('no-match-1.template', data)
    return constructMailtoUrl(receivers, subject, body)
  } else if (template === 'no-match-2') {
    assert(data.length === 1) // [student name]
    let { subject, body } = parse('no-match-2.template', data)
    return constructMailtoUrl(receivers, subject, body)
  }
}
