require('dotenv').config({ path: '../../.env' })
const { db } = require('../config')

const usersRef = db.collection('allowed_users')

const allowedUsers = [
  'mml267@cornell.edu',
  'cl859@cornell.edu',
  'jlc497@cornell.edu',
]

const addUsers = async () => {
  allowedUsers.forEach((email) => {
    usersRef
      .doc(email)
      .set({
        email: email,
      })
      .then(() => {
        console.log('Document successfully written! ')
      })
      .catch(() => {
        console.error('Error writing document: ')
      })
  })
}

addUsers()

module.exports = addUsers
