const { default: axios } = require("axios");
const express = require("express");
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

    res.json({ subject, status: "ok" });
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

router.put("/active/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubject = await Subject.findByIdAndUpdate(id, {
      $set: { active: true },
    });

    const resp = await axios.post(`${process.env.SERVER_URI}/exams/create`, {
      name: updatedSubject.name,
      classNum: updatedSubject.classNum,
      timeOut: req.body.timeOut,
    });

    await updatedSubject.save();

    res.json({
      msg: `${updatedSubject.name} fani bo'yicha ${updatedSubject.classNum} - sinflarga imtihon ochildi!`,
      exam: resp.data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/inactive/:id", async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, {
      $set: { active: false },
    });

    await updatedSubject.save();

    res.json({
      updatedSubject,
      msg: `${updatedSubject.name} fani bo'yicha ${updatedSubject.classNum} - sinflarga imtihon yopildi!`,
      status: "ok",
    });
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

module.exports = router;
