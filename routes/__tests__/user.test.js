//----- Imports
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });
const userRoutes = require("../user");
// Data
const userTestData = require("../../data/userTestData");

//----- Middleware
app.use(express.json()); // needed to test POST requests
app.use("/", userRoutes);

//----- Routes
app.use(require("../user"));

describe("----- User Routes -----", () => {
  beforeEach(done => {
    mongoose.connect(process.env.ATLAS_TESTING_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => {
      const User = mongoose.model("User");
      // Clear initial data
      User.deleteMany({})
      // Insert test data
      .then(() => User.insertMany(userTestData.testUsers))
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

  describe("/users", () => {
    //----- Test 1 -----
    it("(GET) successfully retrieves all users", done => {
      request(app)
      .get("/users")
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.users).toBeDefined();
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users).toHaveLength(3);
        done();
      });
    });

     //----- Test 2 -----
     it("(POST) successfully creates a user", done => {
      request(app)
      .post("/users")
      .send({
        username: userTestData.testNewUser.username,
        password: "Pass"
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(typeof res.body.user === "object").toBe(true);
        expect(res.body.user.username).toBe(userTestData.testNewUser.username);
        done();
      });
    });
  });

  describe("/user/:id", () => {
    //----- Test 3 -----
    it("(GET) successfully retrieves given user", done => {
      request(app)
      .get(`/user/${userTestData.testUser._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(typeof res.body.user === "object").toBe(true);
        expect(res.body.user._id).toBe(userTestData.testUser._id);
        done();
      });
    });

    //----- Test 4 -----
    it("(DELETE) successfully deletes given user", done => {
      request(app)
      .delete(`/user/${userTestData.testUser._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(typeof res.body.user === "object").toBe(true);
        expect(res.body.user._id).toBe(userTestData.testUser._id);
        done();
      });
    });
  });
});