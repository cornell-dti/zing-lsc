const express = require("express");
const router = express.Router();
const { getCourseInfo, getAllCourses } = require("./functions");

router.get("/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  getCourseInfo(courseId)
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err);
      res.status(400).send({ success: false, err: err.message });
    });
});

router.get("/", (req, res) => {
  const courseId = req.params.courseId;
  getAllCourses()
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => {
      console.log(err);
      res.status(400).send({ success: false, err: err.message });
    });
});

module.exports = router;
