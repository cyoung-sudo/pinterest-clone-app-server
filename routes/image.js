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

module.exports = imageRoutes;