const { db } = require("../config");
const { assertIsExistingCourse, assertIsNewCourse } = require("./helpers");
const courseRef = db.collection("courses");

async function addCourse(courseId, name, availableModalities) {
  if (!Array.isArray(availableModalities)) {
    throw new Error("[availableModalities] needs to be a string list");
  }

  await assertIsNewCourse(courseId);

  courseRef.doc(courseId).create({
    name,
    availableModalities,
    students: [],
  });
}

async function addStudentsToCourse(courseId, emails) {
  await assertIsExistingCourse(courseId);
}

module.exports = { addCourse };
