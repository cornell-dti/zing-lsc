const { db } = require("../config");
const admin = require('firebase-admin')
const courseRef = db.collection("courses");
const studentRef = db.collection("students");

// TODO: change to integrate crosslisting.
async function assertIsExistingCourse(courseId) {
  courseRef
    .doc(courseId)
    .get()
    .then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error(`Course ${courseId} does not exist`);
      }
    });
}

async function makeMatches(courseId, groupSize = 2) {
  await assertIsExistingCourse(courseId);

  // get all unmatched students for course.
  const data = (await courseRef.doc(courseId).get()).data()
  const unmatchedStudents = data.unmatched
  const lastGroupNumber = data.lastGroupNumber

  // get relevant student data to get preferred working times
  const studentData = await Promise.all(
    unmatchedStudents.map((studentEmail) =>
      studentRef
        .doc(studentEmail)
        .get()
        .then((snapshot) => {
          if (!snapshot.exists)
            throw new Error(`Student ${studentEmail} does not exist`);
          let d = snapshot.data();
          d["email"] = snapshot.id;
          return d;
        })
        .catch((err) => {
          console.log(err);
          throw new Error(`Error in getting data for ${studentEmail}`);
        })
    )
  );

  studentData.sort(
    (obj1, obj2) => obj1.preferredWorkingTime - obj2.preferredWorkingTime
  );

  // greedily form groups. THESE MAY NOT BE PERFECT.
  let i = 0;
  let groups = [];
  while (i < studentData.length) {
    let nextGroup = studentData
      .slice(i, i + groupSize)
      .map((studentObj) => studentObj.email);
    groups.append({
      groupNumber: 1,
      members: nextGroup,
    });
    i += nextGroup.length;
  }

  // if last group has only one person, make sure they're not lonely :'(
  // Also, only run this if the algorithm is being run on more than one student
  if (studentData.length > 1 && groups[-1].length == 1) {
    const student = groups[-1].pop();
    groups.pop();
    groups[-1].push(student);
  }

  // lastly, update the collections to reflect this matching
  courseRef.doc(courseId).update({
    unmatched: unmatchedStudents.length === 1 ? data : [],
    groups: admin.firestore.FieldValue.arrayUnion(groups),
    lastGroupNumber = unmatchedStudents.length === 1 
                      ? lastGroupNumber 
                      : lastGroupNumber + groups.length
  })
}

module.exports = { makeMatches };
