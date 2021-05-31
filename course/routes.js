const express = require("express");
const { addCourse } = require("./functions");
const router = express.Router();

router.post("/add", (req, res) => {
  const { courseId, name, availableModalities } = req.body;
  addCourse(courseId, name, availableModalities)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(400).json({ success: false, err: err.message }));
});

module.exports = router;
