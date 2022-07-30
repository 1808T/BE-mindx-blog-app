const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const rateSchema = new mongoose.Schema(
  {
    postId: {
      type: ObjectId,
      ref: "Post"
    },
    ratedBy: {
      type: ObjectId,
      ref: "User"
    },
    rate: {
      type: Boolean
    }
  },
  { timestamps: true }
);

const Rate = mongoose.model("Rate", rateSchema);

module.exports = Rate;
