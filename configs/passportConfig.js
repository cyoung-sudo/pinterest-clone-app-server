// Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
// Encryption
const bcrypt = require("bcryptjs");
// Models
const User = require("../models/userModel");

//----- Saves user-obj as cookie in session
// Stored in "req.session.passport.user"
// Passes value to "deserializeUser()" through done()
passport.serializeUser((user, done) => {
  done(null, user);
});

//----- Saves user-obj in request using session-cookie
// Stored in "req.user"
passport.deserializeUser((user, done) => {
  done(null, user);
});

//----- Local authentication strategy
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username })
  .then(doc => {
    // User doesn't exist
    if(!doc) { 
      return done(null, false, { message: "No user found" }); 
    }

    // Not using local strategy
    if(!doc.password) {
      return done(null, false, { message: "Wrong authentication strategy" }); 
    }

    // Validate password
    bcrypt.compare(password, doc.password)
    .then(res => {
      if(res) {
        return done(null, doc);
      } else {
        return done(null, false, { message: "Incorrect password" }); 
      }
    });
  })
  .catch(err => done(err));
}));

//----- Github authentication strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {
  // Find user
  User.findOne({
    githubId: profile.id
  })
  .then(doc => {
    if(!doc) {
      // Create new user
      User.create({
        username: `user${Date.now()}`,
        githubId: profile.id
      }).then(savedDoc => {
        return done(null, savedDoc);
      })
      .catch(err => done(err));
    } else {
      // Github account already in use
      return done(null, doc);
    }
  })
  .catch(err => done(err));
}));