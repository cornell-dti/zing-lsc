import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot

const { db } = require('../config')
import * as admin from 'firebase-admin'
import { Request, Response, NextFunction } from 'express'
import { logger } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import DocumentData = firestore.DocumentData

// get data in global scope so this is shared across all function invocations:
// retrieves the allowed users in the database
export async function getAllAllowedUsers() {
  const adminCollection = await db.collection('allowed_users').get()
  return adminCollection.docs.map(
    (adminDoc: QueryDocumentSnapshot<DocumentData>) => {
      return adminDoc.data()
    }
  )
}

// function courtesy of https://itnext.io/how-to-use-firebase-auth-with-a-custom-node-backend-99a106376c8a
// checks if valid based on the auth token in firebase admin
export function checkAuth(req: Request, res: Response, next: NextFunction) {
  // Bearer token
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1]
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(() => {
        next()
      })
      .catch((err) => {
        console.log(err)
        res
          .status(401)
          .send('Unauthorized: error occurred (credentials may be wrong)')
      })
  } else {
    res.status(401).send('Unauthorized: please sign in')
  }
}

export function logReqBody(req: Request, res: Response, next: NextFunction) {
  logger.info({
    request_type: req.method,
    endpoint: req.originalUrl,
    params: req.params,
    body: req.body,
  })
  next()
}

export async function checkIsAuthorizedFromToken(
  req: Request,
  idToken: string
) {
  const decodedToken = await admin.auth().verifyIdToken(idToken)
  const uid = decodedToken.uid
  const user = await admin.auth().getUser(uid)
  logger.info(
    `${req.method} request on endpoint ${req.originalUrl} called by user ${user.displayName} with uid ${user.uid}`
  )
  const allowedUsersEmails = (await getAllAllowedUsers()).map(
    (user: DocumentData) => user.email
  )
  return user.email && allowedUsersEmails.includes(user.email)
}

export function checkIsAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const idToken = req.headers?.authorization?.split('Bearer ')[1]
  if (idToken) {
    checkIsAuthorizedFromToken(req, idToken)
      .then((isAuth) => {
        if (isAuth) next()
        else res.status(403).send('Unauthorized: not correct permissions')
      })
      .catch(() => {
        res.status(401).send('Unauthorized: please sign in')
      })
  } else {
    // this is the second line of defense so this shouldn't need to be run
    res.status(401).send('Unauthorized: please sign in')
  }
}
