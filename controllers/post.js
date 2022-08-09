const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Post = require("../models/post");
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

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 })
      .limit(12);
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
    const post = await Post.findById(req.params._id);
    res.json({ post, message: "Successfully get post detail" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.editPostById = async (req, res) => {
  const { title, description, content, image } = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params._id,
      {
        $set: { title, description, content, image }
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

exports.getPostsByCategory = async (req, res) => {
  const category = req.params._id;
  try {
    const posts = await Post.find({ category })
      .populate("postedBy", "username avatar")
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json({ posts, message: "Successfully get posts by category" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again." });
  }
};
