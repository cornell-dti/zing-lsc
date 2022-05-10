import * as functions from 'firebase-functions'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { checkAuth, checkIsAuthorized } from './middleware/auth-middleware'
import { db } from './config'

require('dotenv').config({ path: '../.env' })

// import routers
import studentsRouter from './student/routes'
import matchingRouter from './matching/routes'
import courseRouter from './course/routes'

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
app.use('/student', studentsRouter)
app.use('/matching', [checkAuth, checkIsAuthorized], matchingRouter)
app.use('/course', [checkAuth, checkIsAuthorized], courseRouter)

app.get('/getauth/:email', checkAuth, (req, res) => {
  const allowedUsersRef = db.collection('allowed_users')
  allowedUsersRef.get().then((r) => {
    const email = req.params.email
    const data = r.docs.map((doc) => doc.data().email)
    res
      .status(200)
      .send({ success: true, data: { isAuthed: data.includes(email) } })
  })
})

exports.api = functions.https.onRequest(app)
