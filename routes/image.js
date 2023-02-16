const express = require("express");
const imageRoutes = express.Router();
// Models
const Image = require("../models/imageModel");

imageRoutes.route("/images")
//----- Create new image
.post((req, res) => {
  Image.create({
    ownerId: req.body.ownerId,
    url: req.body.url
  })
  .then(savedDoc => {
    res.json({
      success: true,
      image: savedDoc
    });
  })
  .catch(err => {
    console.log(err);
    res.json({
      success: false,
      message: "Duplicate image"
    })
  });
});

imageRoutes.route("/image/:id")
//----- Delete given image
.delete((req, res) => {
  Image.findByIdAndDelete(req.params.id)
  .then(deletedDoc => {
    res.json({
      success: true,
      image: deletedDoc
    });
  })
  .catch(err => console.log(err));
})

imageRoutes.route("/images/user/:userId")
//----- Retrieve all images for given user
.get((req, res) => {
  Image.find({
    ownerId: req.params.userId,
  })
  .then(docs => {
    res.json({
      success: true,
      images: docs
    });
  })
  .catch(err => console.log(err));
})
//----- Delete all images for given user
.delete((req, res) => {
  Image.deleteMany({
    ownerId: req.params.userId
  })
  .then(deletedCount => {
    res.json({
      success: true,
      count: deletedCount.deletedCount
    })
  })
  .catch(err => console.log(err));
});

module.exports = imageRoutes;