const express = require("express");
const httpServer = require("http").createServer;
const { Server } = require("socket.io");
const app = express();
require("dotenv").config();
const { connect } = require("mongoose");
const path = require("path");
const cors = require("cors");
const log = console.log;

const server = httpServer(app);
const io = new Server(server);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "dist")));

io.on("connection", (socket) => {
  console.log("connected to socket");
  socket.on("disconnect", () => {
    console.log("disconnected from socket");
  });
});


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

app.listen(process.env.PORT, () => {
  log(`Server is running on port ${process.env.PORT}`);
});
