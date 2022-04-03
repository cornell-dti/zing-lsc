import * as admin from 'firebase-admin'

// function courtesy of https://itnext.io/how-to-use-firebase-auth-with-a-custom-node-backend-99a106376c8a
// checks if valid based on the auth token in firebase admin
export function checkAuth(req, res, next) {
  // Bearer token
  if (req.headers.authorization) {
    admin
      .auth()
      .verifyIdToken(req.headers.authorization.split(' ')[1])
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
