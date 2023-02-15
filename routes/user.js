const express = require("express");
const userRoutes = express.Router();
// Encryption
const bcrypt = require("bcryptjs");
// Models
const User = require("../models/userModel");

userRoutes.route("/users")
//----- Retrieve all users
.get((req, res) => {
  User.find({})
  .then(allDocs => {
    res.json({
      success: true,
      users: allDocs
    })
  })
  .catch(err => console.log(err));
})
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
})
//----- Delete given user
.delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
  .then(deletedDoc => {
    res.json({
      success: true,
      user: deletedDoc
    })
  })
  .catch(err => console.log(err));
});

module.exports = userRoutes;