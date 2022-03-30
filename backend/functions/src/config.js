const admin = require('firebase-admin')
import 'dotenv/config'

const serviceAccount = require(process.env.SA_PATH)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

module.exports = { db }
