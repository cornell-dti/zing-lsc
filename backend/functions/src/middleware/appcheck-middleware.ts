import { Request, Response, NextFunction } from 'express'
import { appCheck } from 'firebase-admin'
import { logger } from 'firebase-functions/v1'
require('../config')

// Based off of the following snippet and existing code
// https://firebase.google.com/docs/app-check/custom-resource-backend#verify_tokens
export async function appCheckVerification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const appCheckToken = req.header('X-Firebase-AppCheck')
  try {
    await appCheck().verifyToken(appCheckToken || '')
    next()
  } catch {
    logger.warn(`Request failed App Check: ${JSON.stringify(req.headers)}`)
    res.status(401).send('Unauthorized: looking a little sus')
  }
}
