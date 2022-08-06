const User = require("../models/user");
const Post = require("../models/post");

exports.getAllUsers = async (req, res) => {
  if (req.role !== "admin") return res.sendStatus(401);
  try {
    const users = await User.find({ role: "user" }).limit(10);
    res.status(200).json({ users, message: "Successfully get all users." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.role !== "admin") return res.sendStatus(401);
  const userId = req.params.user_id;
  try {
    const response = await User.findByIdAndDelete(userId, { rawResult: true });
    if (response.ok === 1) {
      res.status(200).json({ message: "Successfully delete your post" });
    } else {
      res.status(500).json({ message: "Error. Try again." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllDrafts = async (req, res) => {
  if (req.role !== "admin") return res.sendStatus(401);
  try {
    const drafts = await Post.find({ status: "draft" }).limit(10);
    res.status(200).json({ drafts, message: "Successfully get all drafts" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getDraftDetail = async (req, res) => {
  if (req.role !== "admin") return res.sendStatus(401);
  const postId = req.params.post_id;
  try {
    const draft = await Post.findById(postId).populate("postedBy", "username avatar");
    res.json({ draft, message: "Successfully get draft." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.approveDraft = async (req, res) => {
  if (req.role !== "admin") return res.sendStatus(401);
  const postId = req.params.post_id;
  try {
    const approveDraft = await Post.findByIdAndUpdate(
      postId,
      { $set: { status: "approved" } },
      { new: true }
    );
    res.json({ approveDraft, message: "Successfully approve post." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.deleteDraft = async (req, res) => {
  if (req.role !== "admin") return res.sendStatus(401);
  const postId = req.params.post_id;
  try {
    const response = await Post.findByIdAndDelete(postId, { rawResult: true });
    if (response.ok === 1) {
      res.status(200).json({ message: "Successfully delete your post" });
    } else {
      res.status(500).json({ message: "Error. Try again." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};
