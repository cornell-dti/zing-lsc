const express = require("express");
require("dotenv").config();

// Initialize express app
const app = express();
app.use(express.json());

// import routers
const studentsRouter = require("./student/routes");
const coursesRouter = require("./course/routes");

app.use("/student", studentsRouter);
app.use("/course", coursesRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App listening in port ${port}`));
