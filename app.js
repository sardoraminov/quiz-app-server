const express = require("express");
const app = express();
require("dotenv").config();
const { connect } = require("mongoose");
const path = require("path");
const cors = require('cors');

const log = console.log;

app.use(cors({origin: "*"}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "dist")));


connect(process.env.DB_CONNECTION)
  .then(() => {
    log("Connected to DB");
  })
  .catch((err) => {
    log(err);
  });

app.get("/", (req, res) => {
  res.send(new Date());
});

app.use("/admin", require("./routes/admin"));
app.use("/exams", require("./routes/exam"));

app.listen(process.env.PORT, () => {
  log(`Server is running on port ${process.env.PORT}`);
});
