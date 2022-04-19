import * as admin from 'firebase-admin'
import { Request, Response, NextFunction } from 'express'

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
