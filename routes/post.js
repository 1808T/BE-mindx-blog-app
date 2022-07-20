const express = require("express");
const { createPost, uploadImage } = require("../controllers/post");
const { requireLogin } = require("../middlewares/auth");
const formidable = require("express-formidable");
const postRouter = express.Router();

postRouter.post("/new-post", requireLogin, createPost);
postRouter.post(
  "/upload-image",
  requireLogin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);

module.exports = postRouter;
