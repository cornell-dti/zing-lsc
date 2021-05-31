const express = require("express");
const {
  addStudent,
  deleteStudent,
  updateStudentInformation,
} = require("./functions");
const router = express.Router();

router.post("/add", (req, res) => {
  // TODO: add validation and better error handling.
  const { name, email, modality, timezone } = req.body;
  addStudent(name, email, modality, timezone)
    .then(() =>
      res.status(200).json({
        success: true,
      })
    )
    .catch((err) =>
      res.status(400).json({
        success: false,
        err: err.message,
      })
    );
});

router.delete("/delete/:email", (req, res) => {
  const email = req.params.email;

  deleteStudent(email)
    .then(() =>
      res.status(200).json({
        success: true,
      })
    )
    .catch((err) =>
      res.status(400).json({
        success: false,
        err: err.message,
      })
    );
});

router.post("/update", (req, res) => {
  const { email, modality, timezone } = req.body;
  // TODO: add better validation for emails, modality, timezone.
  updateStudentInformation(email, modality, timezone)
    .then(() =>
      res.status(200).json({
        success: true,
      })
    )
    .catch((err) =>
      res.status(400).json({
        success: false,
        err: err.message,
      })
    );
});

module.exports = router;
