const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    fullname: {
      required: true,
      type: String,
    },
    oneId: {
      required: true,
      type: String,
    },
    exam: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: String,
      default: "",
    },
    class: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
