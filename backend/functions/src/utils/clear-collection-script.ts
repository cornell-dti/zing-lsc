import admin from 'firebase-admin'
import * as fs from 'fs'
import * as path from 'path'
import { clearCollection } from './clearCollection'

const main = async () => {
  const args = process.argv.slice(2)

  const [serviceAccountPathArg, collectionName, recursiveArg] = args

  if (!serviceAccountPathArg || !collectionName) {
    console.error(
      'Usage: node clear-collection-script.js <path_to_service_account_json> <collection_name> [recursive]'
    )
    process.exit(1) // Exit if arguments are missing
  }

  const serviceAccountPath = path.resolve(process.cwd(), serviceAccountPathArg)
  const recursive = recursiveArg === 'true'

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  const db = admin.firestore()

  await clearCollection(db, collectionName, recursive)
}

main()
