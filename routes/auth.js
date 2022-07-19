const express = require("express");
const {
  register,
  login,
  handleCurrentUser,
  getQuestion,
  resetPassword
} = require("../controllers/auth");
const { requireLogin } = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/current-user", requireLogin, handleCurrentUser);

authRouter.post("/forgot-password", getQuestion);
authRouter.put("/forgot-password", resetPassword);

module.exports = authRouter;
