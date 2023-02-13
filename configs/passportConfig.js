const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
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