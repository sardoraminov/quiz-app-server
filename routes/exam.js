const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const Exam = require("../models/Exam");

router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:name", async (req, res) => {
  try {
    const exam = await Exam.findOne({ name: req.params.name });
    res.json(exam);
  } catch (error) {
    console.log(error);
  }
});

router.post("/create", async (req, res) => {
  try {
    const newExam = await new Exam({
      name: req.body.name,
    });

    await newExam.save();

    res.json({ exam: newExam, msg: "Imtihon ochildi!" });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:name/pupil", async (req, res) => {
  try {
    const exam = await Exam.findOne({ name: req.params.name });
    const updatedExam = await Exam.findByIdAndUpdate(exam._id, {
      $inc: { pupils: 1 },
    });

    await updatedExam.save();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
