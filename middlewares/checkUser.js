const User = require("../models/User");

async function checkUser(req, res, next) {
  try {
    const { oneId } = req.body;

    const user = await User.findOne({ oneId });
    if (!user) {
      res.json({
        status: "bad",
        msg: `${oneId} id ga ega o'quvchi topilmadi!`,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { checkUser };
