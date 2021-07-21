const express = require("express");
const functions = require("firebase-functions");
require("dotenv").config();

// Initialize express app
const app = express();
app.use(express.json());

// import routers
const studentsRouter = require("./student/routes");
const matchingRouter = require("./matching/routes");
const courseRouter = require("./course/routes");
// const { makeMatches } = require("./matching/functions");
app.use("/student", studentsRouter);
app.use("/matching", matchingRouter);
app.use("/course", courseRouter);

exports.api = functions.https.onRequest(app);
