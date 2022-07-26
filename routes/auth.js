const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  uploadAvatar,
  deleteAvatar,
  updateCurrentUser,
  changePassword,
  getQuestion,
  resetPassword
} = require("../controllers/auth");
const formidable = require("express-formidable");
const { requireLogin } = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.get("/current-user", requireLogin, getCurrentUser);
authRouter.post(
  "/current-user/avatar",
  requireLogin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadAvatar
);
authRouter.delete("/current-user/avatar", requireLogin, deleteAvatar);
authRouter.put("/current-user", requireLogin, updateCurrentUser);
authRouter.put("/current-user/change-password", requireLogin, changePassword);

authRouter.post("/forgot-password", getQuestion);
authRouter.put("/forgot-password", resetPassword);

module.exports = authRouter;
