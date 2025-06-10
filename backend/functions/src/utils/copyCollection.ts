import admin from 'firebase-admin'

const BATCH_SIZE = 500 // https://firebase.google.com/docs/firestore/quotas#writes_and_transactions

export const copyCollection = async (
  db: admin.firestore.Firestore,
  sourceName: string,
  targetName: string,
  recursive = false
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
