const User = require("../models/user");
const Post = require("../models/post");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json({ users, message: "Successfully get all users." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const response = await User.findByIdAndDelete(userId, { rawResult: true });
    if (response.ok === 1) {
      res.status(200).json({ message: "User deleted!" });
    } else {
      res.status(500).json({ message: "Error. Try again." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.status(200).json({ posts, message: "Successfully get all posts" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getPostDetail = async (req, res) => {
  const postId = req.params.post_id;
  try {
    const draft = await Post.findById(postId).populate("postedBy", "username avatar");
    res.json({ draft, message: "Successfully get draft." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.approvePost = async (req, res) => {
  const postId = req.params.post_id;
  try {
    const approvePost = await Post.findByIdAndUpdate(
      postId,
      { $set: { status: "approved" } },
      { new: true }
    );
    res.json({ approvePost, message: "Approved." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.post_id;
  try {
    const response = await Post.findByIdAndDelete(postId, { rawResult: true });
    if (response.ok === 1) {
      res.status(200).json({ message: "Successfully deleted post" });
    } else {
      res.status(500).json({ message: "Error. Try again." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};
