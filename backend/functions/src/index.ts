import * as functions from 'firebase-functions'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { checkAuth } from './middleware/auth-middleware'

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

// import routers
import studentsRouter from './student/routes'
import matchingRouter from './matching/routes'
import courseRouter from './course/routes'

// auth middleware before router
app.use('/student', studentsRouter)
app.use('/matching', checkAuth, matchingRouter)
app.use('/course', checkAuth, courseRouter)

exports.api = functions.https.onRequest(app)
