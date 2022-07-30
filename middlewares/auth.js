const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { expressjwt: expressJwt } = require("express-jwt");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.requireLogin = expressJwt(
  {
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"]
  },
  (req, res) => {
    if (!req.auth.admin) return res.sendStatus(401);
    res.sendStatus(200);
  }
);

exports.canEditDeletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id);
    if (req.auth._id !== post.postedBy.toString()) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};

exports.canEditDeleteComment = async (req, res, next) => {
  const { commentId, postId } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (comment.postedBy.toString() === req.auth._id && comment.postId.toString() === postId) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};
