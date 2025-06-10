import admin from 'firebase-admin'
import * as fs from 'fs' // Import the 'fs' module
import * as path from 'path' // Import the 'path' module

const BATCH_SIZE = 500 // https://firebase.google.com/docs/firestore/quotas#writes_and_transactions

const copyCollection = async (
  db: admin.firestore.Firestore,
  sourceName: string,
  targetName: string
) => {
  const sourceCollection = db.collection(sourceName)
  const targetCollection = db.collection(targetName)

  const sourceSnapshot: FirebaseFirestore.QuerySnapshot =
    await sourceCollection.get()
  let batch: FirebaseFirestore.WriteBatch = db.batch()
  let copiedCounter = 0 // # of docs copied

  console.log(
    `[INFO] Number of documents to migrate: ${sourceSnapshot.docs.length}`
  )
  for (const doc of sourceSnapshot.docs) {
    const newDocRef: FirebaseFirestore.DocumentReference = targetCollection.doc(
      doc.id
    )
    batch.set(newDocRef, doc.data())
    console.log(`[BATCH] set ${doc.id}`)
    copiedCounter++

    if (copiedCounter % BATCH_SIZE === 0) {
      // batch limit reached, must commit current 500 files
      await batch.commit()
      console.log(`[COMMIT]: ${copiedCounter}`)
      batch = db.batch()
    }
  }

  if (copiedCounter % BATCH_SIZE !== 0) {
    // after all files read, commit any remaining writes
    await batch.commit()
    console.log(`[COMMIT]: ${copiedCounter}`)
  }

  console.log(
    `[SUCCESS] Copied from ${sourceCollection.id} to ${targetCollection.id}`
  )
}

const clearCollection = async (
  db: admin.firestore.Firestore,
  sourceName: string
) => {
  const sourceCollection = db.collection(sourceName)
  const snapshot = await sourceCollection.get()
  let deleted = 0
  let batch = db.batch()
  for (const doc of snapshot.docs) {
    const newDocRef = sourceCollection.doc(doc.id)
    batch.delete(newDocRef)
    console.log(`[BATCH] delete ${doc.id}`)
    deleted++
    if (deleted % BATCH_SIZE === 0) {
      await batch.commit()
      console.log(`[COMMIT]: ${deleted}`)
      batch = db.batch()
    }
  }
  if (deleted % BATCH_SIZE !== 0) {
    await batch.commit()
    console.log(`[COMMIT]: ${deleted}`)
  }
  console.log(`[SUCCESS] Deleted all documents from ${sourceCollection.id}`)
}

const main = async () => {
  const args = process.argv.slice(2)

  const [serviceAccountPathArg] = args
  const sourceName = 'courses'
  const targetName = 'archivedCourses'

  if (!serviceAccountPathArg) {
    console.error(
      'Usage: node migrate-courses.js <path_to_service_account_json>'
    )
    process.exit(1) // Exit if arguments are missing
  }

  const serviceAccountPath = path.resolve(process.cwd(), serviceAccountPathArg)

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  const db = admin.firestore()

  await copyCollection(db, sourceName, targetName)
  console.log('[INFO] Starting to clear collection...')
  await clearCollection(db, sourceName)
}

main()
