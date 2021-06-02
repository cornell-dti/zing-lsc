const { db } = require("../config");
const courseRef = db.collection("courses");

async function assertIsNewCourseHelper(courseId) {
  const snapshot = await courseRef.doc(courseId).get();
  return !snapshot.exists;
}

async function assertIsNewCourse(courseId) {
  if (!(await assertIsNewCourseHelper(courseId)))
    throw new Error(`Course ${courseId} already exists`);
}

async function assertIsExistingCourse(courseId) {
  if (await assertIsNewCourseHelper(courseId))
    throw new Error(`Course ${courseId} doesn't exists`);
}

function assertIsArray(obj) {
  if (!Array.isArray(obj)) {
    throw new Error(`Expected an array, got ${typeof obj} instead.`);
  }
}
module.exports = {
  assertIsNewCourse,
  assertIsExistingCourse,
  assertIsArray,
};
