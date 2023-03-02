//----- Imports
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });
const imageRoutes = require("../image");
// Data
const imageTestData = require("../../data/imageTestData");

//----- Middleware
app.use(express.json()); // needed to test POST requests
app.use("/", imageRoutes);

//----- Routes
app.use(require("../image"));

describe("----- Image Routes -----", () => {
  beforeEach(done => {
    mongoose.connect(process.env.ATLAS_TESTING_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => {
      const Image = mongoose.model("Image");
      // Clear initial data
      Image.deleteMany({})
      // Insert test data
      .then(() => Image.insertMany(imageTestData.testImages))
      .then(() => done())
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, 20000); // Increased timeout to handle slow connection
  
  afterEach(done => {
    // Clear test data
    const Image = mongoose.model("Image");
    Image.deleteMany({})
    .then(() => mongoose.connection.close())
    .then(() => done())
    .catch(err => console.log(err));
  }, 20000);

  describe("/images", () => {
     //----- Test 1 -----
     it("(POST) successfully creates an image", done => {
      request(app)
      .post("/images")
      .send({
        ownerId: imageTestData.testNewImage.ownerId,
        url: imageTestData.testNewImage.url
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.image).toBeDefined();
        expect(typeof res.body.image === "object").toBe(true);
        expect(res.body.image.url).toBe(imageTestData.testNewImage.url);
        done();
      });
    });
  });

  describe("/image/:id", () => {
    //----- Test 2 -----
    it("(DELETE) successfully deletes given image", done => {
      request(app)
      .delete(`/image/${imageTestData.testImage._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.image).toBeDefined();
        expect(typeof res.body.image === "object").toBe(true);
        expect(res.body.image._id).toBe(imageTestData.testImage._id);
        done();
      });
    });
  });

  describe("/images/user/:userId", () => {
    //----- Test 3 -----
    it("(GET) successfully retrieves images for given user", done => {
      request(app)
      .get(`/images/user/${imageTestData.testImage.ownerId}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.images).toBeDefined();
        expect(Array.isArray(res.body.images)).toBe(true);
        expect(res.body.images).toHaveLength(1);
        done();
      });
    });

    //----- Test 4 -----
    it("(DELETE) successfully deletes images for given user", done => {
      request(app)
      .delete(`/images/user/${imageTestData.testImage._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBeDefined();
        expect(typeof res.body.count).toBe("number")
        expect(res.body.count).toBe(1);
        done();
      });
    });
  });
});