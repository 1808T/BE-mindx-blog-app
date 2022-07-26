const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Post = require("../models/post");
const User = require("../models/user");
const Category = require("../models/category");
const cloudinary = require("../utils/cloudinary");

exports.createPost = async (req, res) => {
  const { title, description, content, image, category, status = "draft" } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });
  if (!description) return res.status(400).json({ message: "Description is required" });
  if (!content) return res.status(400).json({ message: "Content is required" });
  if (!image.url || !image.public_id)
    return res.status(400).json({ message: "Please attach an image to your post!" });
  if (!category) return res.status(400).json({ message: "Category is required" });
  const existedCategory = await Category.findOne({ name: category });
  if (!existedCategory) {
    const newCategory = new Category({
      name: category
    });
    await newCategory.save();
    const post = new Post({
      title,
      description,
      content,
      image,
      postedBy: req.auth._id,
      category: newCategory._id,
      status
    });

    try {
      const newPost = await post.save();
      res.status(201).json({ newPost, message: "Successfully submit!!!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error. Try again!!!" });
    }
  } else {
    const categoryId = existedCategory._id;
    const post = new Post({
      title,
      description,
      content,
      image,
      postedBy: req.auth._id,
      category: categoryId,
      status
    });

    try {
      const newPost = await post.save();
      res.status(201).json({ newPost, message: "Successfully submit!!!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error. Try again!!!" });
    }
  }
};

exports.uploadPostImage = async (req, res) => {
  const postImagePath = req.files.image.path;
  try {
    const uploadImage = await cloudinary.uploader.upload(
      postImagePath,
      {
        upload_preset: "images",
        folder: "post_images"
      },
      err => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error. Try again!!!", err });
        }
      }
    );
    res.status(200).json({
      url: uploadImage.secure_url,
      public_id: uploadImage.public_id,
      message: "Image successfully uploaded!"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!", err });
  }
};

exports.deletePostImage = async (req, res) => {
  const { public_id } = req.body;
  try {
    const response = await cloudinary.uploader.destroy(public_id);
    if (response.result === "ok") {
      res.status(200).json({ message: "Clear!!!" });
    } else {
      res.status(500).json({ message: "Error. Try again!!!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!", err });
  }
};

exports.replacePostImage = async (req, res) => {
  const { public_id } = req.fields;
  const postImagePath = req.files.image.path;
  try {
    const replaceImage = await cloudinary.uploader.upload(
      postImagePath,
      { public_id, upload_preset: "images" },
      err => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error. Try again!!!", err });
        }
      }
    );
    res.status(200).json({
      url: replaceImage.secure_url,
      public_id: replaceImage.public_id,
      message: "Image successfully uploaded!"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!", err });
  }
};

exports.getAllApprovedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.status(200).json({ posts, message: "Successfully get all posts" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.getPostDetailById = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id)
      .populate("postedBy", "username avatar")
      .populate("category", "name");
    res.json({ post, message: "Successfully get post detail" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.getAllUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.auth._id })
      .populate("postedBy", "_id username")
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ posts, message: "Successfully get all user's posts", ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.getUserPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id).populate("category", "name");
    res.json({ post, message: "Successfully get post detail" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.editPostById = async (req, res) => {
  const { title, description, content, image, category } = req.body;
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: category });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params._id,
      {
        $set: { title, description, content, image, category: categoryId }
      },
      { new: true }
    );
    res.json({ updatedPost, message: "Your post has been updated." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};

exports.deletePostById = async (req, res) => {
  try {
    const response = await Post.findByIdAndDelete(req.params._id, { rawResult: true });
    try {
      const { public_id } = response.value.image;
      const delPostImage = await cloudinary.uploader.destroy(public_id);
      if (delPostImage.result === "ok") {
        console.log("Image deleted.");
      } else {
        console.log("Failed to delete image.");
      }
    } catch (err) {
      console.log(err);
    }
    if (response.ok === 1) {
      res.status(200).json({ message: "Successfully delete your post" });
    } else {
      res.status(500).json({ message: "Error. Try again." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};

exports.getApprovedPostsByCategory = async (req, res) => {
  const category = req.params._id;
  try {
    const posts = await Post.find({ category, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 })
      .limit(4);
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllApprovedArtPosts = async (req, res) => {
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: "Art" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
  try {
    const posts = await Post.find({ category: categoryId, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllApprovedBookPosts = async (req, res) => {
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: "Book" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
  try {
    const posts = await Post.find({ category: categoryId, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllApprovedFoodPosts = async (req, res) => {
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: "Food" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
  try {
    const posts = await Post.find({ category: categoryId, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllApprovedGamePosts = async (req, res) => {
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: "Game" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
  try {
    const posts = await Post.find({ category: categoryId, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllApprovedHealthPosts = async (req, res) => {
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: "Health And Fitness" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
  try {
    const posts = await Post.find({ category: categoryId, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllApprovedMusicPosts = async (req, res) => {
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: "Music" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
  try {
    const posts = await Post.find({ category: categoryId, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllApprovedPhotographyPosts = async (req, res) => {
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: "Photography" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
  try {
    const posts = await Post.find({ category: categoryId, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.getAllApprovedTechnologyPosts = async (req, res) => {
  let categoryId = null;
  try {
    categoryId = await Category.findOne({ name: "Technology" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
  try {
    const posts = await Post.find({ category: categoryId, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};

exports.searchPosts = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.sendStatus(400);
  const regex = new RegExp(query, "i");
  try {
    const users = (await User.find({ username: { $regex: regex } })).map(user => user._id);
    const searchByUsername = await Post.find({ postedBy: { $in: users }, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name");
    const searchByTitle = await Post.find({ title: { $regex: regex }, status: "approved" })
      .populate("postedBy", "username avatar")
      .populate("category", "name");
    res.json({ searchByUsername, searchByTitle, message: "Successfully get posts!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};
