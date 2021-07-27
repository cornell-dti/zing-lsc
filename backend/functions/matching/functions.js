const { db } = require("../config");
const admin = require("firebase-admin");
const courseRef = db.collection("courses");
const studentRef = db.collection("students");

// =====================  HELPER FUNCTIONS ======================
async function assertIsExistingCourse(courseId) {
  await courseRef
    .doc(courseId)
    .get()
    .then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error(`Course ${courseId} does not exist`);
      }
    });
}

async function updateStudentReferencesForGroup(group, courseId) {
  return group.members.map((member) =>
    updateStudentGroup(member, courseId, group.groupNumber)
  );
}

async function updateStudentGroup(studentEmail, courseId, groupNumber) {
  return studentRef
    .doc(studentEmail)
    .get()
    .then((snapshot) => {
      const data = snapshot.data();
      const groups = data.groups;
      for (let obj of groups) {
        if (obj.courseId === courseId) {
          obj.groupNumber = groupNumber;
          break;
        }
      }
      return [snapshot.ref, groups];
    })
    .then(([ref, groups]) =>
      ref.update({
        groups,
      })
    )
    .catch((err) => console.log(err));
}

// =============================== EXPORTS ==================================
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
    -(studentData.length % groupSize) || undefined //extend to the end of the array if we have perfect groups
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
  await Promise.all(
    [
      courseRef
        .doc(courseId)
        .update({
          unmatched,
          lastGroupNumber: lastGroupNumber + groups.length,
        })
        .catch((err) => console.log(err)),
      groups.map((group) =>
        courseRef
          .doc(courseId)
          .collection("groups")
          .doc(group.groupNumber.toString())
          .set(group, { merge: true })
          .catch((err) => console.log(err))
      ),
      groups.map((group) => updateStudentReferencesForGroup(group, courseId)),
    ].flat()
  );

  return groups;
}

async function getGroups(courseId) {
  await assertIsExistingCourse(courseId);
  const querySnapshotDocs = await courseRef
    .doc(courseId)
    .collection("groups")
    .get();
  const docData = querySnapshotDocs.docs.map((doc) => doc.data());
  return docData;
}

// transfer student from the list of unmatched students to a group
async function addUnmatchedStudentToGroup(courseId, studentEmail, groupNumber) {
  await assertIsExistingCourse(courseId);

  const courseData = (await courseRef.doc(courseId).get()).data();
  let unmatched = courseData.unmatched;

  if (!unmatched.includes(studentEmail))
    throw new Error("This student is not currently unmatched");

  const groupSnapshot = await courseRef
    .doc(courseId)
    .collection("groups")
    .doc(groupNumber.toString())
    .get();

  if (!groupSnapshot.exists) throw new Error("Invalid group provided.");

  unmatched = unmatched.filter((u) => u !== studentEmail);

  await Promise.all([
    courseRef
      .doc(courseId)
      .update({ unmatched })
      .catch((err) => console.log(err)),

    groupSnapshot.ref
      .update({
        members: admin.firestore.FieldValue.arrayUnion(studentEmail),
      })
      .catch((err) => console.log(err)),

    updateStudentGroup(studentEmail, courseId, groupNumber),
  ]);
}

// transfer student from group1 to group2
async function transferStudentBetweenGroups(
  studentEmail,
  group1,
  group2,
  courseId
) {
  await assertIsExistingCourse(courseId);

  // make sure student 1 is indeed in group1
  const group1Data = (
    await courseRef
      .doc(courseId)
      .collection("groups")
      .doc(group1.toString())
      .get()
  ).data();

  if (!group1Data.members.includes(studentEmail))
    throw new Error(
      `The student ${studentEmail} doesn't exist in group${group1}`
    );

  const group1Update = courseRef
    .doc(courseId)
    .collection("groups")
    .doc(group1.toString())
    .update({ members: admin.firestore.FieldValue.arrayRemove(studentEmail) })
    .catch((err) => {
      console.log(err);
      throw new Error(`error in removing ${studentEmail} from group${group1}.`);
    });

  const group2Update = courseRef
    .doc(courseId)
    .collection("groups")
    .doc(group2.toString())
    .update({ members: admin.firestore.FieldValue.arrayUnion(studentEmail) })
    .catch((err) => {
      console.log(err);
      throw new Error(`error in adding ${studentEmail} from group${group2}.`);
    });

  const studentRecordUpdate = updateStudentGroup(
    studentEmail,
    courseId,
    group2
  );

  await Promise.all([group1Update, group2Update, studentRecordUpdate]);
}

module.exports = {
  makeMatches,
  getGroups,
  addUnmatchedStudentToGroup,
  transferStudentBetweenGroups,
};
