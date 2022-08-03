import { db, storage } from '../config'
import { FirestoreEmailTemplate } from '../types'
import admin from 'firebase-admin'

const Timestamp = admin.firestore.Timestamp

const templates: FirestoreEmailTemplate[] = [
  {
    id: 'example-1',
    name: 'Example 1',
    type: 'student',
    subject: 'Subject 1',
    body: 'example-1.html',
    modifyTime: Timestamp.fromDate(new Date('2022-07-23T12:00:00')),
  },
  {
    id: 'example-2',
    name: 'Example 2',
    type: 'group',
    subject: 'Subject 2',
    body: 'example-2.html',
    modifyTime: Timestamp.fromDate(new Date('2022-07-23T13:00:00')),
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
const templatesBucket = storage.bucket('zing-lsc-prod-templates')

templates.forEach((template) =>
  templatesBucket
    .upload(template.body)
    .then(() => console.log(`Successfully uploaded ${template.body}`))
    .catch((e) => console.error(`Failed to upload ${template.body}: ${e}`))
)
