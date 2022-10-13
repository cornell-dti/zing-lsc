import React, { useContext } from 'react'
import { EmailTemplate } from '@core/Types'

interface TemplateContextType {
  templates: EmailTemplate[]
}

const TemplateContext = React.createContext<TemplateContextType>({
  templates: [],
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
