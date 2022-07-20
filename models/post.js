const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const postSchema = new mongoose.Schema(
  {
    title: {
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
    likes: [{ type: ObjectId, ref: "User" }],
    comment: [
      {
        text: String,
        created: { type: Date, default: Date.now },
        postedBy: {
          type: ObjectId,
          ref: "User"
        }
      }
    ]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
