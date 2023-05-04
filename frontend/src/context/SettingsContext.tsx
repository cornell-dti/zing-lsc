import React, { useContext } from 'react'
import { Admin } from '@core/Types'
import { SelectChangeEvent } from '@mui/material'

interface SettingsContextType {
  hasLoadedCurrRoster: boolean
  hasLoadedSurveyState: boolean
  hasLoadedAdministrators: boolean

  currRoster: string
  surveyState: boolean
  administrators: Admin[]
  semesterAdded: boolean

  changeCurrRoster: (event: SelectChangeEvent) => Promise<void>
  changeSurveyAvailability: () => Promise<void>
  removeAdmin: (admin:Admin) => void
  editAdmin: () => void
  addSemester: (selectedSeason: string, year: string) => void
}

const SettingsContext = React.createContext<SettingsContextType>({
  hasLoadedCurrRoster: false,
  hasLoadedSurveyState: false,
  hasLoadedAdministrators: false,

  currRoster: '',
  surveyState: false,
  administrators: [],
  semesterAdded: false,

  changeCurrRoster: async () => {},
  changeSurveyAvailability: async () => {},
  removeAdmin:() => {},
  editAdmin: () => {},
  addSemester: () => {}
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
