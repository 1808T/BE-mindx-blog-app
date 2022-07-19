const bcrypt = require("bcrypt");

exports.hashString = async string => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashString = await bcrypt.hash(string, salt);
    return hashString;
  } catch (err) {
    return console.log(err);
  }
  // return new Promise((resolve, reject) => {
  //   bcrypt.genSalt(10, (err, salt) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     bcrypt.hash(password, salt, (err, hash) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(hash);
  //     });
  //   });
  // });
};

exports.compareString = (string, hashed) => {
  return bcrypt.compare(string, hashed);
};
