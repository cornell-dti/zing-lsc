import firebaseConfig from './firebase.json'
import {
  getAuth,
  signOut,
  OAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { initializeApp } from 'firebase/app'
import { TEMPLATES_BUCKET } from '@core/Constants'

const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const templatesBucket = getStorage(app, TEMPLATES_BUCKET)

// function attempting to sign in with Google
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.addScope('email')
  provider.addScope('profile')
  const result = await signInWithPopup(auth, provider)
  console.log(result)
}

export async function signInWithMicrosoft() {
  const provider = new OAuthProvider('microsoft.com')
  provider.addScope('mail.send')
  const result = await signInWithPopup(auth, provider)
  // user is signed in
  // IdP data available in result.additionalUserInfo.profile

  // get OAuth access token
  const credential = OAuthProvider.credentialFromResult(result)
  return credential?.accessToken
}

export async function adminSignIn() {
  await signInWithMicrosoft().then((res) => {
    window.localStorage.setItem('authToken', res)
  })
}

export function logOut() {
  signOut(auth)
}

// Comment this out if you want to use connect to the real storage during development
if (process.env.NODE_ENV === 'development') {
  connectStorageEmulator(templatesBucket, 'localhost', 9199)
}
