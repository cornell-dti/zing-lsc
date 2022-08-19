import { db, storage } from '../config'
import { FirestoreEmailTemplate } from '../types'
import admin from 'firebase-admin'

const Timestamp = admin.firestore.Timestamp

// When Jen sent the Slack message
const modifyTime = Timestamp.fromDate(new Date('2022-08-08T19:20:56Z'))

const templates: FirestoreEmailTemplate[] = [
  {
    id: 'share-match',
    name: 'Matching',
    type: 'group',
    subject: 'Study Partners!',
    body: 'share-match.html',
    modifyTime,
  },
]

const templateRef = db.collection('email_templates')

templates.forEach((template) =>
  templateRef
    .doc(template.id)
    .set(template)
    .then(() => console.log(`Successfully added ${template.id}`))
    .catch((e) => console.error(`Failed to add ${template.id}: ${e}`))
)

// Storage emulator will automatically create bucket on first write
const templatesBucket = storage.bucket('zing-lsc-templates')

templates.forEach((template) =>
  templatesBucket
    .upload(template.body)
    .then(() => console.log(`Successfully uploaded ${template.body}`))
    .catch((e) => console.error(`Failed to upload ${template.body}: ${e}`))
)
