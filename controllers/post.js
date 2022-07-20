const Post = require("../models/post");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createPost = async (req, res) => {
  console.log(req.body);
  const { title, content, image } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });
  if (!content) return res.status(400).json({ message: "Content is required" });

  const post = new Post({
    title,
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
  // console.log("req.files:", req.files);
  try {
    const uploadImage = await cloudinary.uploader.upload(req.files.image.path);
    // console.log(uploadImage);
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
