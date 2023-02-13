const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

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
  return done(null, profile);
}));