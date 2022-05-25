interface EmailTemplateType {
  templateName: string
  subject: string
  body: string
}

type EmailTemplatesType = EmailTemplateType[]

export const FakeEmailTemplates: EmailTemplatesType = [
  {
    templateName: 'Shared matching results',
    subject: 'foo match',
    body: ``,
  },
]
