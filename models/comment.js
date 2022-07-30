const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: ObjectId,
      ref: "Post"
    },
    postedBy: {
      type: ObjectId,
      ref: "User"
    },
    content: {
      type: String
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
