const express = require("express");
const addStudentSurveyResponse = require("./functions");
const router = express.Router();

router.post("/survey", (req, res) => {
  const {
    name,
    email,
    preferredWorkingTime,
    college,
    year,
    courseCatalogNames,
  } = req.body;

  addStudentSurveyResponse(
    name,
    email,
    preferredWorkingTime,
    college,
    year,
    courseCatalogNames
  )
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      if (err.name == "processing_err") {
        return res.status(500).send({ sucess: false, message: err.message });
      }
      console.log(err);
      return res.status(400).send({ sucess: false, message: err.message });
    });
});
module.exports = router;
