// NOTE: THIS FILE IS NOT TO BE USED UNTIL FURTHER CONFIRMATION BY LSC FOR FUTURE
// DASHBOARD STATUS

const { db } = require("../config");
const { assertIsNewStudent, assertIsExistingStudent } = require("./helpers");
const studentRef = db.collection("students");
const coursesRef = db.collection("courses");

async function addStudent(name, email, modality, timezone) {
  await assertIsNewStudent(email);
  studentRef.doc().set({
    name,
    email,
    modality,
    timezone,
  });
}

async function deleteStudent(email) {
  await assertIsExistingStudent(email);
  const docsRef = await studentRef.where("email", "==", email).get();
  const id = docsRef.docs[0].id;
  await studentRef.doc(id).delete();
}

async function updateStudentInformation(email, modality, timezone) {
  await assertIsExistingStudent(email);
  let docSnapshot = await studentRef.where("email", "==", email).limit(1).get();
  let docId = docSnapshot.docs[0].id;
  if (modality !== undefined) {
    await studentRef.doc(docId).update({
      modality,
    });
  }
  if (timezone !== undefined) {
    await studentRef.doc(docId).update({
      timezone,
    });
  }
}

module.exports = {
  addStudent,
  deleteStudent,
  updateStudentInformation,
};
