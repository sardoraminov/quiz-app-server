const express = require("express");
const Exam = require("../models/Exam");
const router = express.Router();
const Subjects = require("../models/Subject");
const { upload } = require("../utils/upload");



router.put("/update/active/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Update by conditional active field. If active true put the false, and if it is false put true
    const subject = await Subjects.findById(id);
    const updatedSubject = await Subjects.findByIdAndUpdate(id, {
      $set: { active: !subject.active },
    });
    const newExam = await new Exam({
      name: subject.name,
    });

    await newExam.save()
    await updatedSubject.save();

    res.json({msg: "O'zgarishlar saqlandi, imtihon ochildi!"});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
