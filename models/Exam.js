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
    class: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("Exam", examSchema);
