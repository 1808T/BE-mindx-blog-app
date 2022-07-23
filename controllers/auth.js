const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { hashString, compareString } = require("../utils/auth");
const { validateName, validateEmail } = require("../utils/validate");

exports.register = async (req, res) => {
  const { username, email, password, confirmPassword, question, answer } = req.body;
  // VALIDATION
  if (!username) return res.status(400).json({ message: "Username is required" });
  if (!validateName(username))
    return res.status(400).json({ message: "Invalid username. Try again." });
  const existedUsername = await User.findOne({ username });
  if (existedUsername)
    return res.status(400).json({ message: "This username has already been taken" });

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email. Try again." });
  const existedEmail = await User.findOne({ email });
  if (existedEmail) return res.status(400).json({ message: "This email has already been taken" });

  if (!password || password.length < 6)
    return res
      .status(400)
      .json({ message: "Password is required and should be 6 characters long" });
  if (!confirmPassword) return res.status(400).json({ message: "Please confirm your password" });
  if (confirmPassword !== password)
    return res.status(400).json({ message: "Those passwords didn't match. Try again." });

  if (!answer) return res.status(400).json({ message: "Answer is required" });

  // HASH PASSWORD
  const hashedPassword = await hashString(password);
  const hashedAnswer = await hashString(answer);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    question,
    answer: hashedAnswer
  });

  try {
    await user.save();
    return res.status(201).json({
      ok: true
    });
  } catch (err) {
    console.log("Failed to register:", err);
    return res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // CHECK EMAIL & PASSWORD
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found" });
    } else {
      const match = await compareString(password, user.password);
      if (!match) return res.status(400).json({ message: "Wrong password" });
      // CREATE TOKEN
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
      user.password = "";
      user.answer = "";
      res.status(200).json({
        token,
        user,
        message: "Successfully login"
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.getCurrentUser = async (req, res) => {
  // console.log(req.auth);
  try {
    const user = await User.findById(req.auth._id);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      res.json({ user, ok: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.updateCurrentUser = async (req, res) => {
  const { username, firstName, lastName, dob, address, avatar } = req.body;
  try {
    if (!username) {
      const user = await User.findByIdAndUpdate(
        { _id: req.auth._id },
        {
          $set: {
            "about.firstName": firstName,
            "about.lastName": lastName,
            "about.dob": dob,
            "about.address": address,
            avatar: avatar
          }
        },
        { returnDocument: "after" }
      );
      res.status(200).json({ user, message: "Successfully update your info" });
    } else {
      const user = await User.findByIdAndUpdate(
        { _id: req.auth._id },
        {
          $set: {
            username: username,
            "about.firstName": firstName,
            "about.lastName": lastName,
            "about.dob": dob,
            "about.address": address,
            avatar: avatar
          }
        },
        { returnDocument: "after" }
      );
      res.status(200).json({ user, message: "Successfully update your info" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.getQuestion = async (req, res) => {
  const { email } = req.body;
  try {
    const existedUser = await User.findOne({ email });
    if (!existedUser) return res.status(400).json({ message: "No user found!!!" });
    res.status(200).json({ question: existedUser.question });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error. Try again!!!" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, answer, newPassword, confirmNewPassword } = req.body;
  const user = await User.findOne({ email });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "New password should be 6 characters long" });
  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ message: "Those passwords didn't match. Try again." });
  const compareAnswer = await compareString(answer, user.answer);
  if (!compareAnswer) return res.status(400).json({ message: "Wrong answer!!!" });

  try {
    const hashedPassword = await hashString(newPassword);
    const result = await User.updateOne({ email }, { password: hashedPassword });
    if (result.acknowledged === true && result.modifiedCount === 1) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(500).json({ message: "Error. Try again!!!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error. Try again!!!" });
  }
};
