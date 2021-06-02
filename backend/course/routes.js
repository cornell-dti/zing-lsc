const express = require("express");
const {
  addCourse,
  getStudentsForCourse,
  addStudentToCourses,
  removeStudentFromCourse,
} = require("./functions");
const router = express.Router();

router.post("/add-course", (req, res) => {
  const { courseId, name, availableModalities } = req.body;
  addCourse(courseId, name, availableModalities)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(400).json({ success: false, err: err.message }));
});

// TODO: Better error-status handling. This may include things like malformed
// input validation.

router.delete("/remove-student", (req, res) => {
  const { courseId, email } = req.body;
  removeStudentFromCourse(courseId, email)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(400).json({ success: false, err: err.message }));
});

router.post("/add-student-to-courses", (req, res) => {
  const { courseIds, email, name, timezone, modalities } = req.body;
  addStudentToCourses(courseIds, email, name, timezone, modalities)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(400).json({ success: false, err: err.message }));
});

router.get("/students/:courseid", (req, res) => {
  const courseId = req.params.courseid;
  getStudentsForCourse(courseId)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({ success: false, err: err.message }));
});

module.exports = router;
