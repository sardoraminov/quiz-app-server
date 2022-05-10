const { default: axios } = require("axios");
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const Subject = require("../models/Subject");
const { upload } = require("../utils/upload");
require("dotenv").config();

router.post("/create", async (req, res) => {
  try {
    const subject = await new Subject({
      name: req.body.name,
      classNum: req.body.classNum,
      questions: req.body.questions,
    });

    const savedSubject = await subject.save();

    res.json({ savedSubject, status: "ok" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      res.json({
        status: "error",
        message: `Fan savollar to'plami topilmadi.`,
      });
    }
    res.json({ subject: subject });
  } catch (error) {
    console.log(error);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { index, question } = req.body;

    console.log(req.body);

    Subject.findById(req.params.id).then((subject) => {
      subject.questions[index] = question;
      subject.save();
      res.json({
        subject,
        msg: "O'zgarishlar saqlandi",
        status: "ok",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/updateAll/:id", async (req, res) => {
  try {
    console.log(req.body);
    const updatedSubj = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.subject },
      { new: true }
    );

    await updatedSubj.save();

    res.json({ msg: "O'zgarishlar saqlandi", status: "ok", updatedSubj });
  } catch (error) {
    console.log(error);
  }
});

router.put("/active/:name/:classNum", async (req, res) => {
  try {
    const { name, classNum } = req.params;
    const updatedSubject = await Subject.findOneAndUpdate(
      { name, classNum },
      { $set: { active: true } },
      { new: true }
    );

    await updatedSubject.save();

    res.json({
      msg: `${updatedSubject.name} ${updatedSubject.classNum} - sinf to'plami faollashtirildi!`,
      status: "ok",
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/inactive/:name/:classNum", async (req, res) => {
  try {
    const { name, classNum } = req.params;
    const updatedSubject = await Subject.findOneAndUpdate(
      { name, classNum },
      { $set: { active: false } },
      { new: true }
    );

    await updatedSubject.save();

    res.json({
      updatedSubject,
      msg: `${updatedSubject.name} ${updatedSubject.classNum} - sinf to'plami faollashtirildi!`,
      status: "ok",
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubj = await Subject.findByIdAndDelete(id);
    res.json({
      msg: `${deletedSubj.classNum} - sinf ${deletedSubj.name} fan savollar to'plami o'chirildi!`,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/deleteOneQuestion/:id", async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { questions: req.body.question },
      },
      { new: true, multi: true }
    );

    await subject.save();

    res.json({ msg: "Savol o'chirildi", subject });
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
    res.send(error);
  }
});

router.get("/all", async (req, res) => {
  try {
    const subjects = await Subject.find();
    const uniqueNames = [...new Set(subjects.map((subject) => subject.name))];
    const uniqueClasses = [
      ...new Set(subjects.map((subject) => subject.classNum)),
    ];

    if (!subjects) res.json({ status: "bad", message: "No subjects found" });

    res.json({ subject_names: uniqueNames, subject_classes: uniqueClasses, status: "ok" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
