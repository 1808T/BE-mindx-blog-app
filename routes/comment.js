const express = require("express");
const commentRouter = express.Router();
const { requireLogin, canEditDeleteComment } = require("../middlewares/auth");
const { getComment, postComment, editComment, deleteComment } = require("../controllers/comment");

commentRouter.get("/comment/:_id", getComment);
commentRouter.post("/comment", requireLogin, postComment);
commentRouter.put("/comment", requireLogin, canEditDeleteComment, editComment);
commentRouter.delete("/comment", requireLogin, canEditDeleteComment, deleteComment);

module.exports = commentRouter;
