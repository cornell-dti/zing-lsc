import React, { useContext } from 'react'
import { EmailTemplate } from '@core/Types'

interface TemplateContextType {
  hasLoadedTemplates: boolean
  templates: EmailTemplate[]
  keepForm: (
    selectedTemplateId: string,
    templateName: string,
    templateType: 'group' | 'student',
    templateSubject: string,
    templateHtml: string
  ) => void
  appendForm: (
    id: string,
    templateName: string,
    templateType: 'group' | 'student',
    templateSubject: string,
    templateHtml: string
  ) => void
}

const TemplateContext = React.createContext<TemplateContextType>({
  hasLoadedTemplates: false,
  templates: [],
  keepForm: () => {},
  appendForm: () => {},
})

export function TemplateProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: TemplateContextType
}) {
  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplateValue() {
  return useContext(TemplateContext)
}
