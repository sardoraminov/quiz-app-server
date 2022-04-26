const { model, Schema } = require("mongoose");

const subjSchema = new Schema(
  {
    name: String,
    active: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: Array,
      default: [],
      question: {
        question: String,
        optionA: String,
        optionB: String,
        optionC: String,
        optionD: String,
        correct: String,
        img: String,
      },
    },
    class: String
  },
  { timestamps: true }
);

module.exports = model("Subject", subjSchema);
