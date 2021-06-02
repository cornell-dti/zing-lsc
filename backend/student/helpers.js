// NOTE: THIS FILE IS NOT TO BE USED UNTIL FURTHER CONFIRMATION BY LSC FOR FUTURE
// DASHBOARD STATUS

const { db } = require("../config");
const studentRef = db.collection("students");

async function assertIsNewStudentHelper(email) {
  const snapshot = await studentRef.where("email", "==", email).get();
  return !snapshot.docs.length;
}

async function assertIsNewStudent(email) {
  if (!(await assertIsNewStudentHelper(email)))
    throw new Error("This student already exists");
}

async function assertIsExistingStudent(email) {
  if (await assertIsNewStudentHelper(email))
    throw new Error("This student doesn't exist");
}

function validateEmail(emailString) {}

module.exports = { assertIsNewStudent, assertIsExistingStudent };
