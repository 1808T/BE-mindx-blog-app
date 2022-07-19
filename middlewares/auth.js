const { expressjwt: expressJwt } = require("express-jwt");

exports.requireLogin = expressJwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ["HS256"]
});
