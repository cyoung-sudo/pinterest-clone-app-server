const express = require("express");
const userRoutes = express.Router();
// Encryption
const bcrypt = require("bcryptjs");
// Models
const User = require("../models/userModel");

userRoutes.route("/users")
//----- Create new user
.post((req, res) => {
  // Encrypt password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      // Create user
      User.create({
        username: req.body.username,
        password: hash
      })
      .then(savedDoc => {
        res.json({
          success: true,
          user: savedDoc
        })
      })
      .catch(err => {
        console.log(err);
        res.json({
          success: false,
          message: "Username has been taken"
        })
      });
    });
  });
});

userRoutes.route("/user/:id")
//----- Retrieve given user
.get((req, res) => {
  User.findById(req.params.id)
  .then(doc => {
    res.json({
      success: true,
      user: doc
    });
  })
  .catch(err => console.log(err));
});

module.exports = userRoutes;