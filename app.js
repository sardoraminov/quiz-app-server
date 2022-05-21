const express = require("express");
const app = express();
require("dotenv").config();
const { connect } = require("mongoose");
const path = require("path");
const cors = require("cors");
const log = console.log;
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:8080/",
      "http://localhost:8081/",
      "https://quiz-app-admin.vercel.app",
      "https://quiz-app-client-tan.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "dist")));

connect(process.env.ATLAS_URI)
  .then(() => {
    log("Connected to DB");
  })
  .catch((err) => {
    log(err);
  });

app.get("/", (req, res) => {
  res.send(new Date());
});

app.use("/exams", require("./routes/exam"));
app.use("/subjects", require("./routes/subjects"));
app.use("/users", require("./routes/users"));
app.use("/results", require("./routes/results"));

app.listen(process.env.PORT, () => {
  log(`Server is running on port ${process.env.PORT}`);
});
