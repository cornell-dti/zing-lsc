const express = require("express");
const router = express.Router();
const { makeMatches } = require("./functions");

router.post("/make", (req, res) => {
  const { courseId, groupSize } = req.params.courseId;
  (groupSize ? makeMatches(courseId, groupSize) : makeMatches(courseId))
    .then((data) => res.status(200).send({ success: true, data }))
    .catch((err) => console.log(err));
});

module.exports = router;
