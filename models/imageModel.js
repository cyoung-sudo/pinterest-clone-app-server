const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true });

// No duplicate urls for a given user
ImageSchema.index({ ownerId: 1, url: 1 }, { unique: true });

module.exports = mongoose.model("Image", ImageSchema);