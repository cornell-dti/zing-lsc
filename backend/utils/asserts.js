const { db } = require("../config");
const courseRef = db.collection("courses");

async function assertIsNewCourseHelper(courseId) {
  const snapshot = await courseRef.doc(courseId).get();
  return !snapshot.exists;
}

async function assertIsNewCourse(courseId) {
  if (!(await assertIsNewCourseHelper(courseId)))
    throw new Error("This course already exists");
}

async function assertIsExistingCourse(courseId) {
  if (!(await assertIsNewCourseHelper(courseId)))
    throw new Error("This course already exists");
}

module.exports = {
  assertIsNewCourse,
  assertIsExistingCourse,
};
