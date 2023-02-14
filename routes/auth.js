const express = require("express");
const authRoutes = express.Router();
// Authentication
const passport = require("passport");

//----- Local strategy authentication
authRoutes.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if(err) next(err);

    // Invalid login
    if(!user) {
      res.json({
        success: false,
        message: info.message
      });
    } 

    // Successful login
    if(user) {
      req.logIn(user, err => {
        if(err) next(err);
        res.json({
          success: true,
          user
        });
      });
    }
  })(req, res, next);
});

//----- Redirect to github authentication page
authRoutes.get("/auth/github",
  passport.authenticate("github", { scope: [ "user:email" ] }));
 
//----- Callback URL on successful github authentication
authRoutes.get("/auth/github/callback", 
  passport.authenticate("github", { failureRedirect: "http://localhost:3000/login" }),
  function(req, res) {
    // Redirect to client profile page
    res.redirect(`http://localhost:3000/users/${req.user._id}`);
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