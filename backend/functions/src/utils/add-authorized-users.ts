require('dotenv').config({ path: '../../.env' })
const { db } = require('../config')

const usersRef = db.collection('allowed_users')

// put whoever is allowed to access the product in this array and then run the script
const allowedUsers = [
  'mml267@cornell.edu',
  'cl859@cornell.edu',
  'jlc497@cornell.edu',
  'az349@cornell.edu',
  'xsy3@cornell.edu',
  'az354@cornell.edu',
  'bt283@cornell.edu',
  'cww72@cornell.edu',
  'gsh68@cornell.edu',
  'jjw255@cornell.edu',
  'wz282@cornell.edu',
  'pak226@cornell.edu',
  'bh449@cornell.edu',
  'ml953@cornell.edu',
  'cal18@cornell.edu',
  'jcb13@cornell.edu',
  'ama36@cornell.edu',
]

const addUsers = async () => {
  allowedUsers.forEach((email) => {
    usersRef
      .doc(email)
      .set({
        email: email.trim(),
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
