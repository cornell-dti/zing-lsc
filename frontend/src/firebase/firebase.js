import firebaseConfig from './firebase.json'
import {
  getAuth,
  signOut,
  OAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithPopup,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'

initializeApp(firebaseConfig)
export const auth = getAuth()

// function attempting to sign in with Google
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function signInWithMicrosoft() {
  const auth = getAuth()
  const provider = new OAuthProvider('microsoft.com')
  provider.addScope('mail.send')
  await signInWithPopup(auth, provider)
    .then((result) => {
      // user is signed in
      // IdP data available in result.additionalUserInfo.profile

      // get OAuth access token and ID Token
      const credential = OAuthProvider.credentialFromResult(result)
      const accessToken = credential.accessToken
      const idToken = credential.idToken

      console.log('access token: ' + accessToken)
    })
    .catch((error) => {
      // handle error
      console.log('error in ms login' + error)
    })
}

export async function linkWithMicrosoft() {
  const auth = getAuth()
  const provider = new OAuthProvider('miscrosoft.com')
  provider.addScope('mail.send')
  await linkWithPopup(auth.currentUser, provider)
    .then((res) => {
      const credential = OAuthProvider.credentialFromResult(res)
      const accessToken = credential.accessToken
      const idToken = credential.idToken

      console.log('access token: ' + accessToken)
    })
    .catch((error) => {
      // handle error
      console.log('error in ms login' + error)
    })
}
export function logOut() {
  signOut(auth)
}
