import * as functions from 'firebase-functions'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import express from 'express'
import { config } from 'dotenv'
config()
// Initialize express app
const app = express()

app.use(express.json())

// import routers
import studentsRouter from './student/routes'
import matchingRouter from './matching/routes'
import courseRouter from './course/routes'
app.use('/student', studentsRouter)
app.use('/matching', matchingRouter)
app.use('/course', courseRouter)

exports.api = functions.https.onRequest(app)
