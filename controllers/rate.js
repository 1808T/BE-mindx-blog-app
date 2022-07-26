const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Rate = require("../models/rate");

exports.rate = async (req, res) => {
  console.log(req.body);
  const { postId, ratedBy, vote } = req.body;

  try {
    const existedRate = await Rate.findOne({ postId, ratedBy });
    if (existedRate) return res.json({ message: "1" });
    const rate = new Rate({
      postId,
      ratedBy,
      vote
    });
    try {
      await rate.save();
      res.json({ message: "Success", rate });
    } catch (err) {
      console.log(err);
      res.json({ message: "Error", err });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};

exports.delRate = async (req, res) => {
  console.log();
};
