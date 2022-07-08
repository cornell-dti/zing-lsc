import * as functions from 'firebase-functions'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {
  checkAuth,
  checkIsAuthorized,
  checkIsAuthorizedFromToken,
} from './middleware/auth-middleware'
import { unless } from './middleware/unless'

// import routers
import studentsRouter from './student/routes'
import matchingRouter from './matching/routes'
import courseRouter from './course/routes'
import emailRouter from './emailing/routes'
import { appCheckVerification } from './middleware/appcheck-middleware'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Initialize express app
const app = express()

app.use(express.json())
app.use(cors())

// auth middleware before router
app.use(
  '/student',
  [
    appCheckVerification,
    unless(checkAuth, '/survey'),
    unless(checkIsAuthorized, '/survey'),
  ],
  studentsRouter
)
app.use(
  '/matching',
  [appCheckVerification, checkAuth, checkIsAuthorized],
  matchingRouter
)
app.use(
  '/course',
  [appCheckVerification, checkAuth, checkIsAuthorized],
  courseRouter
)
app.use('/email', [appCheckVerification], emailRouter)

app.get('/getauth', checkAuth, (req, res) => {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1]
    checkIsAuthorizedFromToken(idToken).then((isAuthed) => {
      res.status(200).send({
        success: true,
        data: { isAuthed: isAuthed },
      })
    })
  } else {
    res.status(200).send({
      success: true,
      data: { isAuthed: false },
    })
  }
})

exports.api = functions.https.onRequest(app)
