const { db } = require("../config");
const {
  assertIsExistingCourse,
  assertIsNewCourse,
} = require("../utils/asserts");
const courseRef = db.collection("courses");

async function addCourse(courseId, name, availableModalities) {
  if (!Array.isArray(availableModalities)) {
    throw new Error("[availableModalities] needs to be a string list");
  }

  await assertIsNewCourse(courseId);

  courseRef.doc(courseId).create({
    name,
    availableModalities,
  });
}

async function addStudentToCourses(courseIds, email, name, timezone, modality) {
  await courseIds.map((courseId) => assertIsExistingCourse(courseId));

  await Promise.all(
    courseIds.map((courseId) => {
      courseRef.doc(courseId).collection("students").doc().set({
        email,
        name,
        timezone,
        modality,
      });
    })
  );
}

async function removeStudentFromCourse(courseId, email) {}

module.exports = { addCourse };
