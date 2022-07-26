const express = require("express");
const commentRouter = express.Router();
const { requireLogin } = require("../middlewares/auth");
const { rate } = require("../controllers/rate");

commentRouter.post("/comment", requireLogin);

module.exports = commentRouter;
