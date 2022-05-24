const { db } = require('../config')
import * as admin from 'firebase-admin'
import { Request, Response, NextFunction } from 'express'
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

export async function checkIsAuthorizedFromToken(idToken: string) {
  const decodedToken = await admin.auth().verifyIdToken(idToken)
  const uid = decodedToken.uid
  const user = await admin.auth().getUser(uid)
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
