import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from './firebase.json'

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  } else {
    firebase.app() // if already initialized, use that one
  }
}

// function attempting to sign in with Cornell SSO
export const signInSSO = () => {
  const provider = new firebase.auth.SAMLAuthProvider('saml.cornell-sso')

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      console.log(res)
      console.log('Signed in')
    })
    .catch((err) => {
      console.log('Error', err)
    })
}
