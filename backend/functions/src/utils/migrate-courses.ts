import { db } from '../config'
const BATCH_SIZE = 500 // https://firebase.google.com/docs/firestore/quotas#writes_and_transactions

const copyCollection = async (sourceName: string, targetName: string) => {
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

const clearCollection = async (sourceName: string) => {
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
  const [sourceName, targetName] = args

  if (!sourceName || !targetName)
    console.error(
      'Usage: node migrate-courses.js <old_collection_name> <new_collection_name>'
    )

  await copyCollection(sourceName, targetName)
  console.log('[INFO] Starting to clear collection...')
  await clearCollection(sourceName)
}

main()
