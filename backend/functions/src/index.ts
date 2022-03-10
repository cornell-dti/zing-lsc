import * as functions from 'firebase-functions'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require('express')
require('dotenv').config()

// Initialize express app
const app = express()
app.use(express.json())

// import routers
const studentsRouter = require('./student/routes')
const matchingRouter = require('./matching/routes')
const courseRouter = require('./course/routes')
const emailRouter = require('./utils/email')
// const { makeMatches } = require("./matching/functions");
app.use('/student', studentsRouter)
app.use('/matching', matchingRouter)
app.use('/course', courseRouter)
app.use('/email', emailRouter)

exports.api = functions.https.onRequest(app)
