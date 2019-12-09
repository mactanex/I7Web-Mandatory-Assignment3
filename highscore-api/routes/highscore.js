"use strict"; //good practice

var express = require("express");
var router = express.Router();

const ctrlHighscore = require("./../controllers/highscoreController");
const userMiddleware = require("../middleware/userMiddleware");

router.post("/highscore", userMiddleware, ctrlHighscore.updateHighscore);

module.exports = router;