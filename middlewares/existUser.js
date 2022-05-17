const User = require("../models/User");

async function existUser(req, res, next) {
  try {
    const user = await User.findOne({
      oneId: req.body.oneId,
    });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    next();
  } catch (error) {
      console.log(error.message);
  }
}

module.exports = {existUser}
