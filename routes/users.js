const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const { Exam } = require("../models/Exam");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const { checkUser } = require("../middlewares/checkUser");
const { existUser } = require("../middlewares/existUser");

router.get("/", async (req, res) => {
  try {
    User.find().then((users) => {
      const sortedUsers = users.sort((a, b) => {
        return +b.active - +a.active;
      });
      res.json(sortedUsers);
    });
  } catch (error) {
    res.json(error)
  }
});

router.get("/:id", existUser, async (req, res) => {
  try {
    const user = await User.findOne({ oneId: req.params.id });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id/free", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { oneId: req.params.id },
      { $set: { status: "free", exam: "" } },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id/active", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { oneId: req.params.id },
      {
        $set: {
          status: "inExam",
          exam: `${req.body.examName} ${req.body.examClassNum}`,
        },
      },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (error) {}
});

router.post("/create", async (req, res) => {
  try {
    const { oneId, fullname, classNum } = req.body;
    const newUser = await new User({
      oneId,
      fullname,
      classNum,
    });

    await newUser.save();

    res.json({ user: newUser });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(req.body);
    const updatedUser = await User.findByIdAndUpdate(id, {
      $set: req.body.user,
    });

    await updatedUser.save();

    res.json({ user: updatedUser });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted!" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", checkUser, async (req, res) => {
  try {
    const existUser = await User.findOne({ oneId: req.body.oneId });

    const auth_token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      login: true,
      auth_token,
      user: existUser,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/enterexam/:oneId", async (req, res) => {
  try {
    const { oneId } = req.params;
    const existExam = await Exam.findOne({ oneId });
    if (!existExam) {
      res.json({ msg: "Imtihon mavjud emas" });
    }

    const subject = await Subject.findOne({
      name: existExam.name,
      classNum: existExam.classNum,
    });
    let exam;
    if (!req.headers["Exam-token"]) {
      exam = await Exam.findOneAndUpdate(
        { oneId },
        { $inc: { pupils: 1 } },
        { new: true }
      );
      exam.save();
    } else {
      return;
    }
    const exam_token = jwt.sign({ id: existExam._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      examQuestions: subject.questions,
      examName: existExam.name,
      examClassNum: existExam.classNum,
      examTimeOut: existExam.timeOut,
      examOriginalTimeOut: existExam.timeOutOriginal,
      examId: req.params.oneId,
      examFinished: existExam.finished,
      examPupils: exam.pupils,
      exam_token,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/available/:oneId", async (req, res) => {
  try {
    const { oneId } = req.params;
    const user = await User.findOne({ oneId });
    if (!user) return res.json({ msg: "O'quvchi mavjud emas", status: "bad" });
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
