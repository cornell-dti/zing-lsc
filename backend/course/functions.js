const { db } = require("../config");
const courseRef = db.collection("courses");

async function getCourseInfo(courseId) {
  const snapshot = await courseRef.doc(courseId).get();
  if (!snapshot.exists) throw new Error("This course doesn't exist");
  return snapshot.data();
}

async function getAllCourses() {
  const snapshot = await courseRef.get();
  return snapshot.docs.map((doc) => {
    let obj = doc.data();
    obj.courseId = doc.id;
    return obj;
  });
}

module.exports = { getCourseInfo, getAllCourses };
