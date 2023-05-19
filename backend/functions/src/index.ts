import * as functions from 'firebase-functions'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {
  checkAuth,
  checkIsAuthorized,
  checkIsAuthorizedFromToken,
  logReqBody,
} from './middleware/auth-middleware'
import { unless } from './middleware/unless'
import { db } from './config'
import { logger } from 'firebase-functions'

// import routers
import studentsRouter from './student/routes'
import matchingRouter from './matching/routes'
import courseRouter from './course/routes'
import emailRouter from './emailing/routes'
import settingsRouter from './settings/routes'

// global routers - no auth
import globalRouter from './global/routes'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const adminRef = db.collection('allowed_users')

// Initialize express app
const app = express()

app.use(express.json())
app.use(cors())
app.use(logReqBody)

// global routers - no auth
app.use('/global', globalRouter)

// auth middleware before router
app.use(
  '/student',
  [unless(checkAuth, '/survey'), unless(checkIsAuthorized, '/survey')],
  studentsRouter
)
app.use('/matching', [checkAuth, checkIsAuthorized], matchingRouter)
app.use('/course', [checkAuth, checkIsAuthorized], courseRouter)
app.use('/email', [checkAuth, checkIsAuthorized], emailRouter)
app.use('/settings', [checkAuth, checkIsAuthorized], settingsRouter)

app.get('/getauth', checkAuth, (req, res) => {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1]
    checkIsAuthorizedFromToken(req, idToken).then((isAuthed) => {
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

/** Add new user to the allowed users*/
export const addAllowedUser = async (name: string, email: string) => {
  await adminRef
    .doc(email)
    .set({ email, name })
    .catch((err) => {
      console.log(err)
      const e = new Error(`Error in setting ${email} as administrative user`)
      e.name = 'processing_err'
      throw e
    })
}

/** Remove user from allowed users */
export const removeAllowedUser = async (email: string) => {
  await adminRef
    .doc(email)
    .delete()
    .then(() => {
      console.log(`Administrator ${email} successfully deleted!`)
    })
    .catch((err) => {
      console.log(err)
      const e = new Error(`Error in removing administrative user ${email} `)
      e.name = 'processing_err'
      throw e
    })
}

/** Get all administrative users */
export const getAllAllowedUsers = async () => {
  const adminCollection = await adminRef.get()
  return adminCollection.docs.map((adminDoc) => {
    return adminDoc.data()
  })
}

app.post('/admin', (req, res) => {
  const { name, email } = req.body
  addAllowedUser(name, email)
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
    })
})

app.delete('/admin', (req, res) => {
  const { email } = req.body
  removeAllowedUser(email)
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ success: false, err: err.message })
    })
})

app.get('/admin', (_, res) => {
  getAllAllowedUsers()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      logger.error(
        `Unexpected error getting all administrators: ${err.message}`
      )
      res.status(500).send({ message: err.message })
    })
})

exports.api = functions.https.onRequest(app)
