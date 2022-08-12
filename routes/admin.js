const express = require("express");
const { requireLogin, checkAdmin } = require("../middlewares/auth");
const {
  getAllUsers,
  deleteUser,
  getAllPosts,
  getPostDetail,
  approvePost,
  deletePost
} = require("../controllers/admin");

const adminRouter = express.Router();

// USER
adminRouter.get("/all-users", requireLogin, checkAdmin, getAllUsers);
adminRouter.delete("/user/:user_id", requireLogin, checkAdmin, deleteUser);

// POST
adminRouter.get("/all-posts", requireLogin, checkAdmin, getAllPosts);
adminRouter.get("/post/:post_id", requireLogin, checkAdmin, getPostDetail);
adminRouter.put("/post/:post_id", requireLogin, checkAdmin, approvePost);
adminRouter.delete("/post/:post_id", requireLogin, checkAdmin, deletePost);

module.exports = adminRouter;
