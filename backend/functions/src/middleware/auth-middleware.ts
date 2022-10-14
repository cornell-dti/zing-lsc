const { db } = require('../config')
import * as admin from 'firebase-admin'
import { Request, Response, NextFunction } from 'express'
import { logger } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import QuerySnapshot = firestore.QuerySnapshot

// get data in global scope so this is shared across all function invocations:
// retrieves the allowed users in the database
function getAllowedUsers() {
  const users: string[] = []
  db.collection('allowed_users')
    .get()
    .then((querySnapshot: QuerySnapshot) => {
      querySnapshot.forEach((doc) => {
        users.push(doc.id)
      })
    })
  return users
}

const allowedUsers = getAllowedUsers()

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
  // TODO (richardgu): find a way to also log which endpoint is being hit
  let output = `Request Endpoint: ${req.originalUrl}\n
  Request Params: ${JSON.stringify(req.params)}\nRequest Body: ${JSON.stringify(
    req.body
  )}\n`
  if (Object.keys(req.params).length > 0) {
    output += 'REQUEST PARAMS...\n'
    for (const key in req.params) {
      const val = req.params[key]
      output += `${JSON.stringify(key)}: ${JSON.stringify(val)}\n`
    }
  } else {
    output += 'Request params is empty\n'
  }
  if (Object.keys(req.body).length > 0) {
    output += 'REQUEST BODY...\n'
    for (const key in req.body) {
      const val = req.body[key]
      output += `${JSON.stringify(key)}: ${JSON.stringify(val)}\n`
    }
  } else {
    output += 'Request body is empty'
  }
  logger.info(output)
  next()
}

export async function checkIsAuthorizedFromToken(idToken: string) {
  const decodedToken = await admin.auth().verifyIdToken(idToken)
  const uid = decodedToken.uid
  const user = await admin.auth().getUser(uid)
  logger.info(`Called by user ${user.displayName} with uid ${user.uid}`)
  return !!(user.email && allowedUsers.includes(user.email))
}

export function checkIsAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const idToken = req.headers?.authorization?.split('Bearer ')[1]
  if (idToken) {
    checkIsAuthorizedFromToken(idToken)
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
