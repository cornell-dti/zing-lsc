import firebaseConfig from './firebase.json'
import {
  getAuth,
  signOut,
  SAMLAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'

initializeApp(firebaseConfig)
export const auth = getAuth()
export const provider = new SAMLAuthProvider('saml.cornell-sso')

// function attempting to sign in with Cornell SSO
export async function signInSSO() {
  const provider = new SAMLAuthProvider('saml.cornell-sso')

  const userCredential = await signInWithPopup(auth, provider)
  const user = userCredential.user
  console.log('user credential', user)

  // do not need these credentials?
  // const credential = SAMLAuthProvider.credentialFromResult(userCredential)
  // console.log('credential', credential)
}

// this doesn't actually work because Cornell SSO does not have logout.
// maybe redirect this to a page to say close your browser?
export const logOut = () => {
  signOut(auth)
}
