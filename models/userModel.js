const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);