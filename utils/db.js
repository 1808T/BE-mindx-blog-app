const mongoose = require("mongoose");
require("dotenv").config();

const URL = process.env.MONGODB_URI;
const connectToDatabase = () => {
  mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connect to Database");
    })
    .catch(err => {
      console.log(`Failed to connect ${err}`);
    });
};

module.exports = connectToDatabase;
