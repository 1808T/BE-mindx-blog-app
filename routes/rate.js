const express = require("express");
const rateRouter = express.Router();
const { requireLogin } = require("../middlewares/auth");
const { rate } = require("../controllers/rate");

rateRouter.post("/rate", requireLogin, rate);

module.exports = rateRouter;
