"use strict"; //good practice

var express = require("express");
var router = express.Router();

const ctrlHighscore = require("./../controllers/highscoreController");

router.post("/highscore", ctrlHighscore.updateHighscore);

module.exports = router;