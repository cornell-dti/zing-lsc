const { db } = require("../config");
const admin = require("firebase-admin");
const courseR = db.collection("courses");
const studentR = db.collection("students");
const mapCatalogNameToCrseId = require("../course/get_course_id");

// Note: the error handling in this file is done the way it is so it is easier
// to decide response codes based on error type.
const addStudentSurveyResponse = async (
  name,
  email,
  preferredWorkingTime,
  college,
  year,
  courseCatalogNames,
  courseRef = courseR,
  studentRef = studentR
) => {
  // First, update the [student] collection to include the data for the new student
  const studentUpdate = studentRef
    .doc(email)
    .set({
      name,
      college,
      year,
      preferredWorkingTime,
    })
    .catch((err) => {
      console.log(err);
      const e = new Error(`Error in processing studentUpdate for ${email}`);
      e.name = "processing_err";
      throw e;
    });

  const crseIds = await Promise.all(
    courseCatalogNames.map((name) => mapCatalogNameToCrseId(name))
  );
  // Next, update each course record to add this student
  const courseUpdates = courseCatalogNames.map((courseCatalogName, index) =>
    courseRef
      .doc(crseIds[index].toString()) // We want the courseID to allow for crosslisting
      .get()
      .then((snapshot) => {
        // create a record for this course if it doesn't exist already.
        if (!snapshot.exists) {
          return snapshot.ref
            .set({
              unmatched: [],
              names: [courseCatalogName],
              lastGroupNumber: 0,
            })
            .then(() => snapshot.ref)
            .catch((err) => {
              console.log(err);
              const e = new Error(
                `Error in creating course in courseUpdate for course ${courseCatalogName}`
              );
              e.name = "processing_err";
              throw e;
            });
        } else {
          snapshot.ref
            .update({
              names: admin.firestore.FieldValue.arrayUnion(courseCatalogName),
            })
            .catch((err) => {
              console.log(err);
              const e = new Error(
                `Error in updating course in courseUpdate for course ${courseCatalogName}`
              );
              e.name = "processing_err";
              throw e;
            });
        }
        return snapshot.ref;
      })
      .then((snapshotRef) =>
        snapshotRef
          .update({
            unmatched: admin.firestore.FieldValue.arrayUnion(email),
          })
          .catch((err) => {
            console.log(err);
            const e = new Error(
              `Error in updating data for student ${email} in course ${courseCatalogName}`
            );
            e.name = "processing_err";
            throw e;
          })
      )
  );

  const allUpdates = courseUpdates.concat(studentUpdate);
  await Promise.all(allUpdates);
};

module.exports = addStudentSurveyResponse;
