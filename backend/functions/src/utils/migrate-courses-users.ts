import admin from 'firebase-admin'
import * as fs from 'fs' // Import the 'fs' module
import * as path from 'path' // Import the 'path' module

const BATCH_SIZE = 500 // https://firebase.google.com/docs/firestore/quotas#writes_and_transactions

const copyCollection = async (
  db: admin.firestore.Firestore,
  sourceName: string,
  targetName: string,
  recursive = false // Added recursive parameter
) => {
  const sourceCollection = db.collection(sourceName)
  const targetCollection = db.collection(targetName)

  const sourceSnapshot: FirebaseFirestore.QuerySnapshot =
    await sourceCollection.get()
  let batch: FirebaseFirestore.WriteBatch = db.batch()
  let copiedCounter = 0

  console.log(
    `[INFO] Number of documents to migrate from ${sourceName}: ${sourceSnapshot.docs.length}`
  )
  for (const doc of sourceSnapshot.docs) {
    const newDocRef: FirebaseFirestore.DocumentReference = targetCollection.doc(
      doc.id
    )
    batch.set(newDocRef, doc.data())
    console.log(`[BATCH] set ${doc.id} in ${targetName}`)
    copiedCounter++

    if (copiedCounter % BATCH_SIZE === 0) {
      // batch limit reached, must commit current 500 files
      await batch.commit()
      console.log(`[COMMIT]: ${copiedCounter} documents from ${sourceName}`)
      batch = db.batch()
    }

    // Recursively copy subcollections if recursive is true
    if (recursive) {
      const subcollections = await doc.ref.listCollections()
      for (const subCol of subcollections) {
        const newSourcePath = `${sourceName}/${doc.id}/${subCol.id}`
        const newTargetPath = `${targetName}/${doc.id}/${subCol.id}`
        console.log(
          `[INFO] Recursively copying subcollection: ${newSourcePath} to ${newTargetPath}`
        )
        await copyCollection(db, newSourcePath, newTargetPath, true)
      }
    }
  }

  if (copiedCounter % BATCH_SIZE !== 0) {
    // after all files read, commit any remaining writes
    await batch.commit()
    console.log(`[COMMIT]: ${copiedCounter} documents from ${sourceName}`)
  }

  console.log(
    `[SUCCESS] Copied from ${sourceCollection.id} to ${targetCollection.id}`
  )
}

const clearCollection = async (
  db: admin.firestore.Firestore,
  sourceName: string,
  recursive: boolean
) => {
  const sourceCollection = db.collection(sourceName)
  const snapshot = await sourceCollection.get()
  let deleted = 0
  let batch = db.batch()
  for (const doc of snapshot.docs) {
    const newDocRef = sourceCollection.doc(doc.id)

    if (recursive) {
      const nestedCollections = await newDocRef.listCollections()
      for (const subCol of nestedCollections) {
        const subCollectionPath = `${sourceName}/${doc.id}/${subCol.id}`
        console.log(
          `[INFO] recursively clearing subcollection: ${subCollectionPath}`
        )
        await clearCollection(db, subCollectionPath, true)
      }
    }

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

  await copyCollection(db, 'courses', 'archivedCourses', true) // Enabled recursive copy
  console.log('[INFO] Starting to clear courses...')
  await clearCollection(db, 'courses', true)
  console.log('[INFO] Copying users collection...')
  await copyCollection(db, 'students', 'archivedStudents', true) // Enabled recursive copy
  console.log('[INFO] Starting to clear students...')
  await clearCollection(db, 'students', true)
}

main()
