import parse from './TemplateParser'
export {}

function assertEqual(expect: any, expression: any) {
  if (expect !== expression) {
    throw new Error(`AssertionFailure: expected ${expect}, got ${expression}`)
  }
}

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

export default async function getMailUrl(
  receivers: string[],
  template: ValidTemplates,
  data: string[]
) {
  switch (template) {
    case 'matched': {
      assertEqual(0, data.length)
      let { subject, body } = await parse('matching.template', data)
      return constructMailtoUrl(receivers, subject, body)
    }
    case 'no-match-1': {
      assertEqual(2, data.length) // [student name, class]
      let { subject, body } = await parse('no-match-1.template', data)
      return constructMailtoUrl(receivers, subject, body)
    }
    case 'no-match-2': {
      assertEqual(1, data.length) // [student name]
      let { subject, body } = await parse('no-match-2.template', data)
      return constructMailtoUrl(receivers, subject, body)
    }
    default:
      console.log('no template')
  }
}
