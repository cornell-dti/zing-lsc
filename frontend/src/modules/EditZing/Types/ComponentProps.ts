import { GridSize } from '@mui/material'
import { Group, Student } from '@core/Types'
import { TemplateName } from 'EditZing/utils/emailTemplates'
import { EmailTemplate } from '@core/Types'

type IdMap = { [key: string]: string }

export interface UnmatchedGridProps {
  courseId: string
  unmatchedStudents: Student[]
  moveStudent: (
    studentEmail: string,
    courseId: string,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
  handleMatchStudents: () => void
  templateMap: IdMap
  selectedStudents: string[]
  handleAddStudent: (student: string, selected: boolean) => void
  updateNotes: (
    studentEmail: string,
    courseId: string,
    notes: string
  ) => Promise<void>
}

export interface GroupGridProps {
  courseId: string
  studentList: Student[]
  groupNumber: number
  templateMap: IdMap
  groupTimestamps: { [key: string]: Date }
  moveStudent: (
    studentEmail: string,
    courseId: string,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
  createTime: Date
  updateTime: Date
  selected: boolean
  selectedStudents: string[]
  removeGroups: (courseId: string, groupNumber: number, toHide: boolean) => void
  handleChecked: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleAddStudent: (student: string, selected: boolean) => void
  updateNotes: (
    studentEmail: string,
    courseId: string,
    notes: string
  ) => Promise<void>
}

export interface StudentGridProps {
  courseId: string
  student: Student
  groupNumber: number
  xsSize?: GridSize
  templateMap: IdMap
  selected: boolean
  handleAddStudent: (student: string, selected: boolean) => void
  updateNotes: (
    studentEmail: string,
    courseId: string,
    notes: string
  ) => Promise<void>
}

export interface MatchLoadingProps {
  showMatchLoading: boolean
  isCurrentlyGrouping: boolean
  numberGrouping: number
  courseNames: string[]
  setShowMatchLoading: (arg: boolean) => void
}

export interface EmailModalProps {
  selectedStudentEmails: string[]
  selectedGroupNumbers: number[]
  isEmailing: boolean
  setIsEmailing: (arg: boolean) => void
  courseNames: string[]
  setEmailSent: (arg: boolean) => void
  setEmailSentError: (arg: boolean) => void
  setEmailSaved: (arg: boolean) => void
}

export interface NotesModalProps {
  open: boolean
  isSaving: boolean
  name: string
  modalNotes: string
  setModalNotes: (arg: string) => void
  saveModalNotes: () => Promise<void>
  handleClose: () => void
}

export interface TemplateRadioButtonsProps {
  selectedTemplate: EmailTemplate
  setSelectedTemplate: (value: EmailTemplate) => void
  templates: EmailTemplate[]
  setGroupTemplates: (
    templates: {
      groupNumber: number
      template: EmailTemplate
    }[]
  ) => void
  selectedGroupNumbers: number[]
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
export interface EmailEditProps {
  template: EmailTemplate
  replacedHtml: string
  setSelectedTemplate: (value: EmailTemplate) => void
  replaceSelectedTemplate: (value: EmailTemplate) => void
  setSingleGroupTemplate: any // temporary
  setEmailSaved: (arg: boolean) => void
  groupNumber?: number
}

export interface DeleteGroupProps {
  open: boolean
  handleClose: () => void
}
