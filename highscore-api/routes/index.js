"use strict"; //good practice

var express = require("express");
var router = express.Router();

const ctrlAccount = require("./../controllers/accountController");

/* GET home page. */

router.post("/login", ctrlAccount.login);

router.post("/signup", ctrlAccount.signup);

router.get("/logout", ctrlAccount.logout);

module.exports = router;