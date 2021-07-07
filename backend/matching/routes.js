const express = require("express");
const router = express.Router();
const {
  makeMatches,
  getGroups,
  addUnmatchedStudentToGroup,
  transferStudentBetweenGroups,
} = require("./functions");

router.post("/make", (req, res) => {
  const { courseId, groupSize } = req.body;
  (groupSize ? makeMatches(courseId, groupSize) : makeMatches(courseId))
    .then((data) => res.status(200).json({ success: true, data }))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ success: false, err: err.message });
    });
});

router.get("/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  getGroups(courseId)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ success: false, err: err.message });
    });
});

router.post("/transfer/unmatched", (req, res) => {
  const { courseId, studentEmail, groupNumber } = req.body;
  addUnmatchedStudentToGroup(courseId, studentEmail, groupNumber)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ success: false, err: err.message });
    });
});

router.post("/transfer/intergroup", (req, res) => {
  const { courseId, studentEmail, group1, group2 } = req.body;
  transferStudentBetweenGroups(studentEmail, group1, group2, courseId)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ success: false, err: err.message });
    });
});

module.exports = router;
