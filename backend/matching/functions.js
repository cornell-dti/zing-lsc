const { db } = require("../config");
const admin = require("firebase-admin");
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
  const data = (await courseRef.doc(courseId).get()).data();
  const unmatchedStudents = data.unmatched;
  const lastGroupNumber = data.lastGroupNumber;

  // get relevant student data to get preferred working times
  let studentData = await Promise.all(
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
  let groupCounter = 0;
  let groups = [];

  // we won't match students who don't form a full group
  let studentDataSliced = studentData.slice(
    0,
    -(studentData.length % groupSize)
  );
  while (i < studentDataSliced.length) {
    let nextGroup = studentDataSliced
      .slice(i, i + groupSize)
      .map((studentObj) => studentObj.email);
    groups.push({
      groupNumber: groupCounter + lastGroupNumber,
      members: nextGroup,
    });
    i += nextGroup.length;
    groupCounter += 1;
  }

  const matchedStudentSet = new Set(studentDataSliced.map((s) => s.email));
  const unmatched = unmatchedStudents.filter((s) => !matchedStudentSet.has(s));

  // lastly, update the collections to reflect this matching
  await Promise.all([
    courseRef
      .doc(courseId)
      .update({
        unmatched,
        lastGroupNumber: lastGroupNumber + groups.length,
      })
      .catch((err) => console.log(err)),
    ...groups.map((group) =>
      courseRef
        .doc(courseId)
        .collection("groups")
        .doc(group.groupNumber.toString())
        .set(group, { merge: true })
        .catch((err) => console.log(err))
    ),
  ]);

  return groups;
}

module.exports = { makeMatches };
