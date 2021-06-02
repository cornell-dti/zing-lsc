const { db } = require("../config");
const {
  assertIsExistingCourse,
  assertIsNewCourse,
  assertIsArray,
} = require("../utils/asserts");
const combineArrays = require("../utils/combine-array");
const courseRef = db.collection("courses");

async function addCourse(courseId, name, availableModalities) {
  assertIsArray(availableModalities);
  await assertIsNewCourse(courseId);

  courseRef.doc(courseId).create({
    name,
    availableModalities,
  });
}

async function addStudentToCourses(
  courseIds,
  email,
  name,
  timezone,
  modalities
) {
  assertIsArray(courseIds);
  await courseIds.map((courseId) => assertIsExistingCourse(courseId));
  await Promise.all(
    combineArrays(courseIds, modalities).map(async (pair) => {
      const courseId = pair[0];
      const modality = pair[1];
      const availableModalities = (await courseRef.doc(courseId).get()).data()[
        "availableModalities"
      ];
      if (!availableModalities.includes(modality))
        throw new Error(
          `Invalid modality provided for ${courseId}: ${modality}`
        );
      courseRef.doc(courseId).collection("students").doc(email).set({
        email,
        name,
        timezone,
        modality,
        matched: false,
      });
    })
  );
}

async function removeStudentFromCourse(courseId, email) {
  await assertIsExistingCourse(courseId);
  const studentRef = await courseRef
    .doc(courseId)
    .collection("students")
    .where("email", "==", email)
    .get();

  if (studentRef.docs[0] === undefined)
    throw new Error("this student isn't currently enrolled in this course");

  await studentRef.docs[0].ref.delete();
}

async function getStudentsForCourse(courseId) {
  await assertIsExistingCourse(courseId);
  const data = (
    await courseRef.doc(courseId).collection("students").get()
  ).docs.map((doc) => doc.data());
  return data;
}

module.exports = {
  addCourse,
  addStudentToCourses,
  removeStudentFromCourse,
  getStudentsForCourse,
};
