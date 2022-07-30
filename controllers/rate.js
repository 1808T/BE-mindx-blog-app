const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Rate = require("../models/rate");

exports.rate = async (req, res) => {
  console.log(req.body);
  const { postId, rate } = req.body;

  try {
    const existedRate = await Rate.findOne({ ratedBy: req.auth._id, postId });
    if (existedRate) {
      if (rate === existedRate.rate) {
        try {
          const result = await Rate.findByIdAndDelete(existedRate._id, {
            rawResult: true
          });
          if (result.ok === 1) {
            res.status(200).json({ message: "Successfully delete rate" });
          } else {
            res.status(500).json({ message: "Error. Try again." });
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error. Try again.", err });
        }
      } else {
        try {
          const updatedRate = await Rate.findByIdAndUpdate(
            existedRate._id,
            { $set: { rate } },
            { new: true }
          );
          res.status(200).json({ updatedRate, message: "Your rate has been updated." });
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error. Try again.", err });
        }
      }
    } else {
      const userRate = new Rate({
        postId,
        ratedBy: req.auth._id,
        rate
      });
      try {
        await userRate.save();
        res.status(200).json({ message: "New rate created", userRate });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error. Try again.", err });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};

exports.countRate = async (req, res) => {
  const postId = req.params._id;
  try {
    const likes = await Rate.find({ postId: new ObjectId(postId), rate: true });
    const dislikes = await Rate.find({ postId: new ObjectId(postId), rate: false });
    res.status(200).json({ likes: likes, dislikes: dislikes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again.", err });
  }
};
