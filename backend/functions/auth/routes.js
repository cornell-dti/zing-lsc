const express = require("express");
const { signIn } = require("./functions");
const router = express.Router();

router.get("/signin", (req, res) => {
  signIn();
});
