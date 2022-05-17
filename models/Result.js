const { model, Schema } = require("mongoose");

const resultSchema = new Schema(
  {
    examId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Result", resultSchema);
