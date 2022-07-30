const express = require("express");
// const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const connectToDatabase = require("./utils/db");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const rateRouter = require("./routes/rate");
const commentRouter = require("./routes/comment");

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
// app.use(express.static(path.join(__dirname + "/public")));

// ROUTE
app.use("/api", authRouter);
app.use("/api", postRouter);
app.use("/api", rateRouter);
app.use("/api", commentRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${PORT}`);
    connectToDatabase();
  }
});
