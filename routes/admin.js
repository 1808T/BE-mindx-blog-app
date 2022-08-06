const express = require("express");
const { requireLogin, checkAdmin } = require("../middlewares/auth");
const {
  getAllUsers,
  deleteUser,
  getAllDrafts,
  getDraftDetail,
  approveDraft,
  deleteDraft
} = require("../controllers/admin");

const adminRouter = express.Router();

// USER
adminRouter.get("/all-users", requireLogin, checkAdmin, getAllUsers);
adminRouter.delete("/:user_id", requireLogin, checkAdmin, deleteUser);

// POST
adminRouter.get("/all-drafts", requireLogin, checkAdmin, getAllDrafts);
adminRouter.get("/:post_id", requireLogin, checkAdmin, getDraftDetail);
adminRouter.put("/:post_id", requireLogin, checkAdmin, approveDraft);
adminRouter.delete("/:post_id", requireLogin, checkAdmin, deleteDraft);

module.exports = adminRouter;
