"use strict"; //good practice

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "kan ikke vaere tom"],
      index: true
    },
    hash: String,
    salt: String,
    highscore: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

accountSchema.plugin(uniqueValidator, {
  message: "findes allerede."
});

accountSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 90000, 32, "sha512")
    .toString("hex");
};

accountSchema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 90000, 32, "sha512")
    .toString("hex");
  return this.hash === hash;
};

accountSchema.methods.generateJwt = function() {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // Use 1 hour for better security
  return jwt.sign(
    {
      _id: this._id,
      email: this.username,
      name: this.username,
      exp: parseInt(expiry.getTime() / 1000) // as Unix time in seconds
    },
    process.env.JWT_SECRET
  ); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

const User = mongoose.model("User", accountSchema);
module.exports.User = User;
