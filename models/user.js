const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
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
      max: 32
    },
    question: {
      type: String
    },
    answer: {
      type: String,
      required: true
    },
    about: {},
    avatar: {
      url: String,
      public_id: String
    },
    role: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
