const { model, Schema } = require("mongoose");

const resultSchema = new Schema(
  {
    exam: {
      type: String,
      required: true,
    },
    examId: {
      type: String,
      required: true
    },
    pupil: {
      type: String,
      required: true,
    },
    pupilId: {
      type: String,
      required: true
    },
    rating: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Result", resultSchema);
