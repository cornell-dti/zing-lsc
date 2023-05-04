import React, { useContext } from 'react'
import { EmailTemplate } from '@core/Types'

interface SettingsContextType {
  hasLoadedSettings: boolean
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

const SettingsContext = React.createContext<SettingsContextType>({
  hasLoadedSettings: false,
  templates: [],
  keepForm: () => {},
  appendForm: () => {},
})

export function SettingsProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: SettingsContextType
}) {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsValue() {
  return useContext(SettingsContext)
}
