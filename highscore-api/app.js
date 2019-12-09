// "use strict"; //good practice

const Server = require("ws").Server;
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require("./DAL/db");

const apiIndexRouter = require("./routes/index");
const apiHighscoreRouter = require("./routes/highscore");

const app = express();
const cors = require("cors");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "dist/ExerciseWorker")));
app.use(cors());

app.use("/api", apiIndexRouter);
app.use("/api", apiHighscoreRouter);
app.get("*", (req, res) => {
  res.sendFile("dist/ExerciseWorker/index.html", {
    root: __dirname
  });
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({
      message: err.name + ": " + err.message
    });
  }
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: "error"
  });
});

const port = 3333;

const httpServer = app.listen(port, () =>
  console.log(`Mandatory assignment 3 listening on port ${port}!`)
);

const wsServer = new Server({
  server: httpServer
});

wsServer.on('connection', () => {
  wsServer.clients.forEach(c => c.send("Hej"))
})

module.exports.app = app;
process.WebSocket = wsServer;