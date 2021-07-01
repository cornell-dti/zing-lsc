require("dotenv").config({ path: "../.env" });
const { db } = require("../config");
const addStudentSurveyResponse = require("../student/functions");
const studentRef = db.collection("students_test");
const courseRef = db.collection("courses_test");

const selectPreferredWorkingTime = () => {
  return Math.floor(Math.random() * 6);
};

const selectCollege = () => {
  const colleges = ["engineering", "a&s", "cals", "dyson"];
  return colleges[Math.floor(Math.random() * colleges.length)];
};

const getRandomSample = (arr, n) => {
  // taken from https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

const selectClasses = (numClasses = 3) => {
  const classes = [
    "CS1110",
    "CS2110",
    "INFO1300",
    "ECON1110",
    "MATH1920",
    "PHYS2213",
  ];
  return getRandomSample(classes, numClasses);
};

const addTestStudents = async () => {
  const alphabet = Array.from("abcdefghijklmnopqrstuvwxyz");
  await Promise.all(
    alphabet.map((a) =>
      addStudentSurveyResponse(
        a,
        `${a}@gmail.com`,
        selectPreferredWorkingTime(),
        selectCollege(),
        2022,
        selectClasses(),
        courseRef,
        studentRef
      )
    )
  );
};

addTestStudents();

module.exports = addTestStudents;
