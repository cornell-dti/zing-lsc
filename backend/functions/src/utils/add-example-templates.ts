import { db, storage } from '../config'
import { FirestoreEmailTemplate } from '../types'
import admin from 'firebase-admin'

const Timestamp = admin.firestore.Timestamp

// When Jen sent the Slack message
const modifyTime = Timestamp.fromDate(new Date('2022-08-08T19:20:56Z'))

// Subjects start with TEST since there is no separate test inbox
// In production the TEST part of the subject will be manually removed
const templates: FirestoreEmailTemplate[] = [
  {
    id: 'share-match',
    name: 'Matching',
    type: 'group',
    subject: 'TEST Study Partners!',
    body: 'share-match.html',
    modifyTime,
  },
  {
    id: 'no-match-yet',
    name: 'No match yet',
    type: 'student',
    subject: 'TEST Update about your study partner request',
    body: 'no-match-yet.html',
    modifyTime,
  },
  {
    id: 'add-student',
    name: 'Add student to established group',
    type: 'group',
    subject: 'TEST Adding a student to your study group',
    body: 'add-student.html',
    modifyTime,
  },
  {
    id: 'check-in',
    name: 'Check-in with group',
    type: 'group',
    subject: 'TEST Checking in about your study group',
    body: 'check-in.html',
    modifyTime,
  },
  {
    id: 'introduce-new-student',
    name: 'Introducing student to established group',
    type: 'group',
    subject: 'TEST Introducing a new student to your study group',
    body: 'introduce-new-student.html',
    modifyTime,
  },
  {
    id: 'no-match-session-closed',
    name: 'No match, session closed',
    type: 'student',
    subject: 'TEST Update about your study partner request',
    body: 'no-match-session-closed.html',
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
