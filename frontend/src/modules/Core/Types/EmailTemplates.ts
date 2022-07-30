export interface EmailTemplate {
  id: string
  name: string
  type: 'group' | 'student'
  subject: string
  body: string
  modifyTime: Date
  html: string
}

export interface ResponseEmailTemplate {
  id: string
  name: string
  type: 'group' | 'student'
  subject: string
  body: string
  modifyTime: string
}

export interface EmailTemplatesResponse {
  success: boolean
  data: ResponseEmailTemplate[]
}

export const responseEmailTemplateToEmailTemplate = (
  template: ResponseEmailTemplate
): EmailTemplate => ({
  ...template,
  modifyTime: new Date(template.modifyTime),
  html: '',
})
