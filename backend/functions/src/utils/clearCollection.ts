import admin from 'firebase-admin'

const BATCH_SIZE = 500 // https://firebase.google.com/docs/firestore/quotas#writes_and_transactions

export const clearCollection = async (
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
