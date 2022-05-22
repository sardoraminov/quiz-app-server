const Result = require("../models/Result");
const User = require("../models/User");
const Subject = require("../models/Subject");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:examId", async (req, res) => {
  const { examId } = req.params;
  try {
    const results = await Result.find({
      examId,
    });

    res.json(results);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:pupilId/", async (req, res) => {
  const { pupilId } = req.params;
  try {
    const results = await Result.find({
      pupilId,
    });
    res.json(results);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Result.findByIdAndDelete(id);
    res.json({ msg: `Imtihon natijasi o'chirildi!` });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/all", async (req, res) => {
  try {
    await Result.deleteMany();
    res.json({ msg: `Natijalar o'chirildi!` });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;