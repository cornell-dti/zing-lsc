import { GridSize } from '@mui/material'
import { Student } from '@core/Types'
import { Group } from './CourseInfo'
import { TemplateName } from 'EditZing/utils/emailTemplates'
import { EmailTemplate } from '@core/Types'

type IdMap = { [key: string]: string }

export interface UnmatchedGridProps {
  courseId: string
  unmatchedStudents: Student[]
  moveStudent: (
    studentToMove: Student,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
  matchStudents: () => void
  templateMap: IdMap
  handleAddStudent: (student: string, selected: boolean) => void
  updateNotes: (student: string, notes: string) => void
}

export interface GroupGridProps {
  courseId: string
  studentList: Student[]
  groupNumber: number
  templateMap: IdMap
  groupTimestamps: { [key: string]: Date }
  moveStudent: (
    studentToMove: Student,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
  createTime: Date
  updateTime: Date
  selected: boolean
  handleChecked: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleAddStudent: (student: string, selected: boolean) => void
  updateNotes: (student: string, notes: string) => void
}

export interface StudentGridProps {
  courseId: string
  student: Student
  groupNumber: number
  xsSize?: GridSize
  templateMap: IdMap
  handleAddStudent: (student: string, selected: boolean) => void
  updateNotes: (student: string, notes: string) => void
}

export interface MatchLoadingProps {
  showMatchLoading: boolean
  isCurrentlyGrouping: boolean
  numberGrouping: number
  courseNames: string[]
  setShowMatchLoading: (arg: boolean) => void
}

export interface EmailModalProps {
  selectedStudents: string[]
  selectedGroups: Group[]
  isEmailing: boolean
  setIsEmailing: (arg: boolean) => void
  courseNames: string[]
  setEmailSent: (arg: boolean) => void
  setEmailSentError: (arg: boolean) => void
  handleEmailTimestamp: () => void
}

export interface NotesModalProps {
  open: boolean
  isSaving: boolean
  name: string
  modalNotes: string
  setModalNotes: (arg: string) => void
  saveModalNotes: () => void
  handleClose: () => void
}

export interface TemplateRadioButtonsProps {
  selectedTemplate: EmailTemplate
  setSelectedTemplate: (value: EmailTemplate) => void
  templates: EmailTemplate[]
}

export interface EmailModalContentProps {
  selectedGroups: Group[]
  courseNames: string[]
  isEmailing: boolean
  setIsEmailing: (arg: boolean) => void
}

export interface EmailPreviewProps {
  template: EmailTemplate
  replacedHtml: string
}
