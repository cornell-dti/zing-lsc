import firebaseConfig from './firebase.json'
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'

initializeApp(firebaseConfig)
export const auth = getAuth()

// function attempting to sign in with Google
export async function signInSSO() {
  const provider = new GoogleAuthProvider()

  const userCredential = await signInWithPopup(auth, provider)
  const user = userCredential.user
  console.log('user credential', user)
}

// this doesn't actually work because Cornell SSO does not have logout.
// maybe redirect this to a page to say close your browser?
export async function logOut() {
  signOut(auth)
}
