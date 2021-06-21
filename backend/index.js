const express = require("express");
require("dotenv").config();

// Initialize express app
const app = express();
app.use(express.json());

// import routers
const studentsRouter = require("./student/routes");
const test = require("./utils/add-test-data");
app.use("/student", studentsRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App listening in port ${port}`));
