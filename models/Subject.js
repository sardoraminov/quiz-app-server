const { model, Schema } = require("mongoose");

const subjSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    classNum: {
      type: String,
      required: true,
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
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Subject", subjSchema);
