export const HOME_PATH = '/'
export const SURVEY_PATH = '/survey'
export const CREATE_ZING_PATH = '/createzing'
export const EDIT_ZING_PATH = '/edit'
export const DASHBOARD_PATH = '/dashboard'
export const EMAIL_PATH = '/email'
export const TEMPLATE_EDITOR_PATH = '/templates'

// NODE_ENV will be 'production' for yarn build, and 'development' for yarn start
// See https://create-react-app.dev/docs/adding-custom-environment-variables/
export const API_ROOT =
  process.env.NODE_ENV === 'production'
    ? 'https://us-central1-zing-lsc.cloudfunctions.net/api'
    : 'http://localhost:5001/zing-lsc/us-central1/api'

export const INSTRUCTOR_API = '/instructor'
export const COURSE_API = '/course'
export const MATCHING_API = '/matching'
export const STUDENT_API = '/student'

export const TEMPLATES_BUCKET = 'gs://zing-lsc-templates'
