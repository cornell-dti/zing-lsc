import * as admin from 'firebase-admin'

// function courtesy of https://itnext.io/how-to-use-firebase-auth-with-a-custom-node-backend-99a106376c8a
// checks if valid based on the auth token in firebase admin
export function checkAuth(req, res, next) {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then(() => {
        next()
      })
      .catch(() => {
        res.status(403).send('Unauthorized: error occurred')
      })
  } else {
    res.status(403).send('Unauthorized: please sign in')
  }
}
