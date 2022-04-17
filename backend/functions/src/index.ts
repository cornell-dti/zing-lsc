import * as functions from 'firebase-functions'
import { checkAuth, checkIsAuthorized } from './middleware/auth-middleware'

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
// const { makeMatches } = require("./matching/functions");

// auth middleware before router
app.use('/student', studentsRouter)
app.use('/matching', [checkAuth, checkIsAuthorized], matchingRouter)
app.use('/course', [checkAuth, checkIsAuthorized], courseRouter)

exports.api = functions.https.onRequest(app)
