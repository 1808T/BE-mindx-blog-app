const { expressjwt: expressJwt } = require("express-jwt");
const Post = require("../models/post");

exports.requireLogin = expressJwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ["HS256"]
});

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
