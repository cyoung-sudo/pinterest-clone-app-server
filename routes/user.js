const express = require("express");
const userRoutes = express.Router();
// Models
const User = require("../models/userModel");

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