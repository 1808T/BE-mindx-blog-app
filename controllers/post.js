const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Post = require("../models/post");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createPost = async (req, res) => {
  const { title, description, content, image } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });
  if (!description) return res.status(400).json({ message: "Description is required" });
  if (!content) return res.status(400).json({ message: "Content is required" });

  const post = new Post({
    title,
    description,
    content,
    image,
    postedBy: req.auth._id
  });
  try {
    await post.save();
    return res.status(201).json({ message: "Successfully submit!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const uploadImage = await cloudinary.uploader.upload(req.files.image.path);
    res.status(200).json({
      url: uploadImage.secure_url,
      public_id: uploadImage.public_id,
      message: "Image uploaded successfully!"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("postedBy", "_id username")
      .sort({ updatedAt: -1 })
      .limit(12);
    res.status(200).json({ posts, message: "Successfully get all posts" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.getAllUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.auth._id })
      .populate("postedBy", "_id username")
      .sort({ createdAt: -1 });
    // console.log(posts);
    res.status(200).json({ posts, message: "Successfully get all user's posts", ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.getPostDetail = async (req, res) => {
  try {
    console.log(req.params._id);
    const post = await Post.findOne({ _id: new ObjectId(req.params._id) });
    console.log(post);
    res.json({ post, message: "Successfully get post detail" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};
