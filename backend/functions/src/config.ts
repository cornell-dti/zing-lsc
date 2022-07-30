import admin from 'firebase-admin'

const serviceAccount: string = require('../service-account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const storage = admin.storage()

export { db, storage }
