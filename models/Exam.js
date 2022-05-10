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
    classNum: {
      type: String,
      required: true,
    },
    timeOut: {
      type: Number,
      required: true,
    },
    timeOutOriginal: {
      type: String,
      required: true,
    },
    oneId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = {
  Exam: model("Exam", examSchema),
  Schema: examSchema,
};
