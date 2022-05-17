const express = require("express");
const router = express.Router();
const { Exam } = require("../models/Exam");
const { default: axios } = require("axios");
const { checkExam } = require("../middlewares/checkExam");
const Subject = require("../models/Subject");
const User = require("../models/User");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    console.log(error);
  }
});

router.get("/forusers", async (req, res) => {
  try {
    const exams = await Exam.find({ finished: false }).sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findOne({
      oneId: req.params.id,
      active: true,
    });
    const subject = await Subject.findOne({
      name: exam.name,
      classNum: exam.classNum,
    });
    res.json({
      examQuestions: subject.questions,
      examName: exam.name,
      examClassNum: exam.classNum,
      examTimeOut: exam.timeOut,
      examOriginalTimeOut: exam.timeOutOriginal,
      examId: req.params.id,
      examFinished: exam.finished,
      examPupils: exam.pupils,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/create", checkExam, async (req, res) => {
  try {
    const newExam = await new Exam({
      name: req.body.name,
      classNum: req.body.classNum,
      timeOut: req.body.timeOut,
      timeOutOriginal: req.body.timeOutOriginal,
      oneId: req.body.oneId,
    });

    const { data } = await axios.put(
      `${process.env.SERVER_URI}/subjects/active/${req.body.name}/${req.body.classNum}`
    );

    const savedExam = await newExam.save();

    let myInterval;

    myInterval = setInterval(async () => {
      const updatedExam = await Exam.findByIdAndUpdate(
        savedExam._id,
        { $inc: { timeOut: -1000 } },
        { new: true }
      );
      if (updatedExam) {
        if (updatedExam.timeOut === 0 || updatedExam.timeOut < 0) {
          await Exam.findByIdAndUpdate(
            updatedExam._id,
            { $set: { finished: true } },
            { new: true }
          );
          clearInterval(myInterval);
          await axios
            .put(
              `${process.env.SERVER_URI}/subjects/inactive/${req.body.name}/${req.body.classNum}`
            )
            .then((res) => {
              console.log(res.data.msg);
            });
        }
      } else {
        return;
      }
    }, 1000);

    res.json({
      msg: `${savedExam.name} fani bo'yicha ${savedExam.classNum} - sinflar uchun imtihon ochildi!`,
      exam: newExam,
      subject: data.msg,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id/pupil", async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { pupils: 1 },
      },
      { new: true }
    );

    await updatedExam.save();

    res.json(updatedExam);
  } catch (error) {
    console.log(error);
  }
});

router.put("/finish/:id", async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        $set: { finished: true },
      },
      { new: true }
    );

    const updatedSubj = await Subject.findOneAndUpdate(
      { name: updatedExam.name, classNum: updatedExam.classNum },
      { $set: { active: false } },
      { new: true }
    );

    const users = await User.find({
      exam: `${req.params.name} ${req.params.classNum}`,
    });

    users.forEach((user) => {
      user.exam = "";
      user.status = "free";
      user.save();
    });

    res.json({
      msg: `${updatedExam.name} fani bo'yicha ${updatedExam.classNum} - sinflar uchun imtihon yopildi!`,
      exam: updatedExam,
      subject: updatedSubj.active,
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id/:name/:classNum", async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    const { data } = await axios.put(
      `${process.env.SERVER_URI}/subjects/inactive/${req.params.name}/${req.params.classNum}`
    );

    const users = await User.find({
      exam: `${req.params.name} ${req.params.classNum}`,
    });

    users.forEach((user) => {
      user.exam = "";
      user.status = "free";
      user.save();
    });

    res.json({
      msg: `${req.params.name} fani bo'yicha ${req.params.classNum} - sinflarga imtihon yopildi!`,
      subject: data.msg,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/available/:id", async (req, res) => {
  try {
    const exam = await Exam.findOne({ oneId: req.params.id, active: true });
    if (!exam) return res.json({ msg: "Imtihon mavjud emas!", status: "bad" });
    res.json({ exam, status: "ok" });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id/pupilLeave", async (req, res) => {
  try {
    const updatedExam = await Exam.findOneAndUpdate(
      { oneId: req.params.id },
      {
        $inc: { pupils: -1 },
      },
      { new: true }
    );

    res.json({ exam: updatedExam, status: "ok", msg: "Imtihondan chiqdingiz" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
