const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: {},
      required: true
    },
    postedBy: {
      type: ObjectId,
      ref: "User"
    },
    image: {
      url: String,
      public_id: String
    },
    status: {
      type: String,
      required: true
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
