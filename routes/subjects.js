const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const { upload } = require("../utils/upload");
require("dotenv").config();

router.post("/create", async (req, res) => {
  try {
    upload.array("image", +req.body.limit);

    const existingSubject = await Subject.findOne({
      name: req.body.name,
      class: req.body.classNum,
    });

    if (existingSubject) {
      res.json({ status: "bad", msg: "Bunday savol to'plami tizimda mavjud!" });
    }

    const subject = await new Subject({
      name: req.body.name,
      classNum: req.body.class,
      questions: req.body.questions,
    });

    const savedSubject = await subject.save();

    res.json(savedSubject);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:name/:classNum", async (req, res) => {
  try {
    const { index, question } = req.body;

    Subject.findOne({
      name: req.params.name,
      class: req.params.classNum,
    }).then((subject) => {
      subject.questions[index] = question;
      subject.save();
      res.json({
        subject,
        msg: "Savollar to'plami yangilandi",
        status: "ok",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/active/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubject = await Subject.findByIdAndUpdate(id, {
      $set: { active: true },
    });

    const resp = await axios.post(`${process.env.SERVER_URI}/exams/create`, {
      name: updatedSubject.name,
      class: updatedSubject.class,
      timeOut: req.body.timeOut,
    });

    await updatedSubject.save();

    res.json({
      msg: "O'zgarishlar saqlandi. Imtihon ochildi",
      exam: resp.data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/inactive", async (req, res) => {
  try {
    const updatedSubject = await Subject.findOneAndUpdate(
      { name: req.body.name, class: req.body.classNum },
      { $set: { active: false } }
    );

    await updatedSubject.save();

    res.json(updatedSubject);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.json({ msg: "Fan savollari o'chirildi!" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    Subject.find().then((subjects) => {
      const sortedSubjs = subjects.sort((a, b) => {
        return +b.active - +a.active;
      });

      res.json(sortedSubjs);
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/", async (req, res) => {
  try {
    await Subject.deleteMany();

    res.json({ msg: "Deleted!" });
  } catch (error) {
    res.send(error)
  }
});

module.exports = router;
