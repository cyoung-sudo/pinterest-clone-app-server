const express = require("express");
const authRoutes = express.Router();
// Authentication
const passport = require("passport");
// Models
const User = require("../models/userModel");

//----- Redirect to github authentication page
authRoutes.get("/auth/github",
  passport.authenticate("github", { scope: [ "user:email" ] }));
 
//----- Callback URL on successful github authentication
authRoutes.get("/auth/github/callback", 
  passport.authenticate("github", { failureRedirect: "http://localhost:3000/login" }),
  function(req, res) {
    // Check if github account already in use
    User.findOne({
      githubId: req.user.id
    })
    .then(doc => {
      if(doc) {
        return doc;
      } else {
        // Create new user
        return User.create({
          username: `user${Date.now()}`,
          githubId: req.user.id
        });
      }
    })
    .then(result => {
      // Redirect to client profile page
      res.redirect(`http://localhost:3000/users/${result._id}`);
    })
    .catch(err => console.log(err));
  });

//----- Logout user
authRoutes.post("/auth/logout", (req, res) => {
  req.logout(err => {
    if(err) console.log(err);
    res.json({ success: true });
  });
});

//----- Retrieve authenticated user
authRoutes.get("/auth/user", (req, res) => {
  if(req.user) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
    res.json({
      success: false,
      message: "No active session"
    });
  }
});

module.exports = authRoutes;