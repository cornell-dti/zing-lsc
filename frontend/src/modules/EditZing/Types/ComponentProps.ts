import { GridSize } from '@mui/material'
import { Student } from './Student'
import { Group } from './CourseInfo'
import { TemplateName } from 'EditZing/utils/emailTemplates'

export interface UnmatchedGridProps {
  unmatchedStudents: Student[]
  moveStudent: (
    studentToMove: Student,
    fromGroupNumber: number,
    toGroupNumber: number
  ) => void
  matchStudents: () => void
  handleAddStudent: (student: string, selected: boolean) => void
}

export interface GroupGridProps {
  studentList: Student[]
  groupNumber: number
  shareMatchEmailTimestamp: Date | null
  checkInEmailTimestamp: Date | null
  addStudentEmailTimestamp: Date | null
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
}

export interface StudentGridProps {
  student: Student
  groupNumber: number
  xsSize?: GridSize
  submissionTime: Date
  handleAddStudent: (student: string, selected: boolean) => void
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

export interface TemplateRadioButtonsProps {
  selectedTemplate: string
  setSelectedTemplate: (value: TemplateName) => void
}

export interface EmailModalContentProps {
  selectedGroups: Group[]
  courseNames: string[]
  isEmailing: boolean
  setIsEmailing: (arg: boolean) => void
}

export interface EmailPreviewProps {
  templateName: TemplateName
  courseNames: string[]
}
