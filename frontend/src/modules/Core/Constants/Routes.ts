export const HOME_PATH = '/'
export const ADMIN_PATH = '/admin'
export const SURVEY_PATH = '/survey'
export const CREATE_ZING_PATH = '/createzing'
export const EDIT_ZING_PATH = '/edit'
export const DASHBOARD_PATH = '/dashboard'
export const METRICS_PATH = '/metrics'
export const EMAIL_PATH = '/email'
export const TEMPLATE_EDITOR_PATH = '/templates'
export const SETTINGS_PATH = '/settings'

// NODE_ENV will be 'production' for yarn build, and 'development' for yarn start
// See https://create-react-app.dev/docs/adding-custom-environment-variables/
export const API_ROOT =
  process.env.NODE_ENV === 'production'
    ? 'https://us-central1-zing-lsc-prod.cloudfunctions.net/api'
    : 'http://localhost:5001/zing-lsc-prod/us-central1/api'

export const INSTRUCTOR_API = '/instructor'
export const COURSE_API = '/course'
export const MATCHING_API = '/matching'
export const STUDENT_API = '/student'
export const SETTINGS_API = '/settings'

export const TEMPLATES_BUCKET = 'gs://zing-lsc-prod-templates'
