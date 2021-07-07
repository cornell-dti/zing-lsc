const express = require("express");
require("dotenv").config();

// Initialize express app
const app = express();
app.use(express.json());

// import routers
const studentsRouter = require("./student/routes");
const matchingRouter = require("./matching/routes");
const courseRouter = require("./course/routes");
const { makeMatches } = require("./matching/functions");
app.use("/student", studentsRouter);
app.use("/matching", matchingRouter);
app.use("/course", courseRouter);

const port = process.env.PORT || 8000;
makeMatches("350025");
app.listen(port, () => console.log(`App listening in port ${port}`));
