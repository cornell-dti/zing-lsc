import admin from 'firebase-admin'
import * as fs from 'fs'
import * as path from 'path'
import { copyCollection } from './copyCollection'

const main = async () => {
  const args = process.argv.slice(2)

  const [serviceAccountPathArg, sourceName, targetName, recursiveArg] = args

  if (!serviceAccountPathArg || !sourceName || !targetName) {
    console.error(
      'Usage: node copy-collection-script.js <path_to_service_account_json> <source_collection_name> <target_collection_name> [recursive]'
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

  await copyCollection(db, sourceName, targetName, recursive)
}

main()
