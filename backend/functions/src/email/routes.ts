import { Router } from 'express'
import { config } from 'dotenv'
import { sendEmail } from './functions'

const router = Router()
config()

// Modulated sending email functions
router.post('/send', (req, res, next) => {
  sendEmail(req, res)
})

export default router
