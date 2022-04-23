const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

router.post("/create", upload.single("img"), async (req, res) => {
  try {
    const { name, questions } = req.body;
    const newSubject = await new Subject({ name, questions });
    const savedSubject = await newSubject.save();

    res.json(savedSubject);
  } catch (error) {
    console.log(error);
  }
});

router.put("/updateActive/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    const updatedSubject = await Subject.findByIdAndUpdate(id, {
      $set: { active: !subject.active },
    });

    await updatedSubject.save();

    res.json({ msg: "O'zgarishlar saqlandi, imtihon ochildi!" });
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

module.exports = router;
