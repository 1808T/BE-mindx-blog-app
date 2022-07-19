const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64
    },
    question: {
      type: String
    },
    answer: {
      type: String,
      required: true
    },
    about: {},
    photo: String
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
