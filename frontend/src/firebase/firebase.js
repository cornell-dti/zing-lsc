import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from '@fire/firebase.json'

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  } else {
    firebase.app() // if already initialized, use that one
  }
}
