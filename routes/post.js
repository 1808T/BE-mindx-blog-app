const express = require("express");
const {
  createPost,
  uploadPostImage,
  deletePostImage,
  replacePostImage,
  getAllPosts,
  getPostDetailById,
  getAllUserPosts,
  getUserPostById,
  editPostById,
  deletePostById
} = require("../controllers/post");
const { requireLogin, canEditDeletePost } = require("../middlewares/auth");
const formidable = require("express-formidable");
const postRouter = express.Router();

postRouter.post("/new-post", requireLogin, createPost);

postRouter.post(
  "/image",
  requireLogin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadPostImage
);
postRouter.delete("/image", requireLogin, deletePostImage);
postRouter.put(
  "/image",
  requireLogin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  replacePostImage
);

postRouter.get("/all-posts", getAllPosts);
postRouter.get("/post/:_id", getPostDetailById);

postRouter.get("/user/your-posts", requireLogin, getAllUserPosts);
postRouter.get("/user/your-posts/:_id", requireLogin, getUserPostById);
postRouter.put("/user/edit/:_id", requireLogin, canEditDeletePost, editPostById);
postRouter.delete("/user/delete/:_id", requireLogin, canEditDeletePost, deletePostById);

module.exports = postRouter;
