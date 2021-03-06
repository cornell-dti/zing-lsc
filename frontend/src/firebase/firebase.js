import firebaseConfig from './firebase.json'
import {
  getAuth,
  signOut,
  OAuthProvider,
  GoogleAuthProvider,
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
