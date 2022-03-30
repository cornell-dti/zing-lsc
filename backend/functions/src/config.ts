import admin = require('firebase-admin')
import { config } from 'dotenv'
config()

import serviceAccount from '../service-account.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

export { db }
