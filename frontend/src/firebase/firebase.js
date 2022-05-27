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
  // const provider = new OAuthProvider('microsoft.com')
  // provider.addScope('mail.send')
  // await signInWithPopup(auth, provider)
  //   .then((res) => {
  //     // user is signed in
  //     // IdP data available in result.additionalUserInfo.profile

  //     // get OAuth access token and ID Token
  //     const credential = OAuthProvider.credentialFromResult(res)
  //     const accessToken = credential.accessToken
  //     const idToken = credential.idToken

  //     console.log('access token: ' + accessToken)
  //     console.log('id token: ' + idToken)
  //     return credential.accessToken
  //   })
  //   .catch((error) => {
  //     // handle error
  //     console.log('error in ms login' + error)
  //   })
  let accessToken
  const provider = new OAuthProvider('microsoft.com')
  provider.addScope('mail.send')
  const result = await signInWithPopup(auth, provider)
  // user is signed in
  // IdP data available in result.additionalUserInfo.profile

  // get OAuth access token and ID Token
  const credential = OAuthProvider.credentialFromResult(result)
  accessToken = credential?.accessToken
  return accessToken
}

export function logOut() {
  signOut(auth)
}
