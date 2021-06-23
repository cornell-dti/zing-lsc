const express = require("express");
const router = express.Router();
const { makeMatches, getGroups } = require("./functions");

router.post("/make", (req, res) => {
  const { courseId, groupSize } = req.params.courseId;
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

module.exports = router;
