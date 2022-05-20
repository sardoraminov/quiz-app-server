const {Exam} = require("../models/Exam");

async function checkExam(req, res, next) {
  try {
    const exam = await Exam.findOne({
      name: req.body.name,
      classNum: req.body.classNum,
      finished: false
    });

    if (exam) {
      res.json({
        msg: "Imtihon allaqachon mavjud!",
        status: "bad",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {checkExam}