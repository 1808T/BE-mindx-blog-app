const express = require("express");
const rateRouter = express.Router();
const { requireLogin } = require("../middlewares/auth");
const { rate, countRate } = require("../controllers/rate");

rateRouter.put("/rate", requireLogin, rate);

rateRouter.get("/count-rate/:_id", countRate);

module.exports = rateRouter;
