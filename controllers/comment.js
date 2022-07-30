const mongoose = require("mongoose");
const Comment = require("../models/comment");

exports.getComment = async (req, res) => {
  const postId = req.params._id;
  try {
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate("postedBy", "_id username avatar");
    res.status(200).json({ comments, message: "Successfully get all post comments." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};

exports.postComment = async (req, res) => {
  const { postId, content } = req.body;

  if (!content) return res.sendStatus(400);

  const comment = new Comment({
    postId,
    postedBy: req.auth._id,
    content
  });

  try {
    await comment.save();
    res.status(201).json({ comment, message: "New comment created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};

exports.editComment = async (req, res) => {
  const { commentId, content } = req.body;
  if (!content) return res.sendStatus(400);

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content } },
      { new: true }
    );
    res.json({ updatedComment, message: "Comment updated." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.body;

  try {
    const result = await Comment.findByIdAndDelete(commentId, { rawResult: true });
    if (result.ok === 1) {
      res.status(200).json({ message: "Your comment has been deleted." });
    } else {
      res.status(500).json({ message: "Error. Try again." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};
