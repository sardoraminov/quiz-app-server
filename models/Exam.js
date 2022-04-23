const { model, Schema } = require("mongoose");

const examSchema = new Schema(
  {
    name: String,
    pupils: {
      type: Number,
      default: 0,
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("Exam", examSchema);
