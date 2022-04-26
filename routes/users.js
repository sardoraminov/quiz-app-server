const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const Exam = require("../models/Exam");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");

router.get("/", async (req, res) => {
  try {
    User.find().then((users) => {
      const sortedUsers = users.sort((a, b) => {
        return +b.active - +a.active;
      });
      res.json(sortedUsers);
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/create", async (req, res) => {
  try {
    const { oneId, fullname, classNum } = req.body;
    const newUser = await new User({
      oneId,
      fullname,
      class: classNum,
    });

    await newUser.save();

    res.json(newUser);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, {
      $set: req.body,
    });

    await updatedUser.save();

    res.json(updatedUser);
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

router.post("/login", async (req, res) => {
  try {
    const existUser = await User.findOne({ oneId: req.body.oneId });
    if (existUser) {
      const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({
        login: true,
        token,
        user: existUser,
      });
    }
    res.json({ msg: "Bu ID tizimda mavjud emas!" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/enterexam/:name/:classNum", async (req, res) => {
  try {
    const { name, classNum } = req.params;
    const existExam = await Exam.findOne({ name, class: classNum });
    if (!existExam) {
      res.json({ msg: "Imtihon mavjud emas" });
    }

    const resp = await axios.put(
      `${process.env.SERVER_URI}/exams/${existExam._id}/pupil`
    );

    res.json({
      examQuestions: existExam.questions,
      examName: existExam.name,
      examClass: existExam.class,
      pupilsInExam: resp.data.pupils,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
