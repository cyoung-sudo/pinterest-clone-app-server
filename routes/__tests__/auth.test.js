//----- Imports
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });
// Session
const session = require("express-session");
// Passport
const passport = require("passport");
require("../../configs/passportConfig");
// Encryption
const bcrypt = require("bcryptjs");
// Data
const userTestData = require("../../data/userTestData");

//----- Middleware
app.use(express.json()); // needed to test POST requests
// Session (needs to be above passport)
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//----- Routes
app.use(require("../auth"));

describe("----- Auth Routes -----", () => {
  beforeEach(done => {
    mongoose.connect(process.env.ATLAS_TESTING_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => {
      const User = mongoose.model("User")
      // Clear initial data
      User.deleteMany({})
      // Insert test data
      .then(async () => {
        // Encrypt test password
        let testUser = {...userTestData.testUser};
        testUser.password = await new Promise((resolve, reject) => {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(testUser.password, salt, (err, hash) => {
              resolve(hash);
            });
          });
        });

        return User.create(testUser);
      })
      .then(() => done())
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, 20000); // Increased timeout to handle slow connection
  
  afterEach(done => {
    // Clear test data
    const User = mongoose.model("User");
    User.deleteMany({})
    .then(() => mongoose.connection.close())
    .then(() => done())
    .catch(err => console.log(err));
  }, 20000);

  describe("/auth/login", () => {
    //----- Test 1 -----
    it("(POST) successfully logs user in", done => {
      request(app)
      .post("/auth/login")
      .send({
        username: userTestData.testUser.username,
        password: userTestData.testUser.password
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(typeof res.body.user === 'object').toBe(true);
        expect(res.body.user._id).toBe(userTestData.testUser._id);
        done();
      });
    });
  });

  describe("/auth/github", () => {
    //----- Test 2 -----
    it("(GET) successfully ...", done => {
      expect(true).toBe(true);
      done();
    });
  });

  describe("/auth/github/callback", () => {
    //----- Test 3 -----
    it("(GET) successfully ...", done => {
      expect(true).toBe(true);
      done();
    });
  });

  describe("/auth/logout", () => {
    //----- Test 4 -----
    it("(POST) successfully logs user out", done => {
      request(app)
      .post("/auth/logout")
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        done();
      });
    });
  });

  describe("/auth/user", () => {
    //----- Test 5 -----
    it("(GET) successfully ...", done => {
      expect(true).toBe(true);
      done();
    });
  });
});