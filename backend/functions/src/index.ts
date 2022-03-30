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
