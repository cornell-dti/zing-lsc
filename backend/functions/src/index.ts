import * as functions from 'firebase-functions'
import 'dotenv/config'
import * as cors from 'cors'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require('express')

// Initialize express app
const app = express()
app.use(express.json())
app.use(cors())

// import routers
const studentsRouter = require('./student/routes')
const matchingRouter = require('./matching/routes')
const courseRouter = require('./course/routes')
// const { makeMatches } = require("./matching/functions");
app.use('/student', studentsRouter)
app.use('/matching', matchingRouter)
app.use('/course', courseRouter)

exports.api = functions.https.onRequest(app)
