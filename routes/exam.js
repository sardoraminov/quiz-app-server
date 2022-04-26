const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const { default: axios } = require("axios");
require('dotenv').config();

router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    res.json(exam);
  } catch (error) {
    console.log(error);
  }
});

router.post("/create", async (req, res) => {
  try {
    const newExam = await new Exam({
      name: req.body.name,
      class: req.body.classNum,
    });

    await newExam.save();

    res.json(newExam);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id/pupil", async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, {
      $inc: { pupils: 1 },
    });

    await updatedExam.save();

    res.json(updatedExam);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id/:name/:class", async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    const resp = await axios.delete(`${process.env.SERVER_URI}/subjects/inactive`, {
      name: req.params.name, classNum: req.params.class,
    });

  } catch (error) {
    
  }
});

module.exports = router;
