const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    fullname: String,
    oneId: String,
    subject: String,
    status: String,
    rating: String,
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
