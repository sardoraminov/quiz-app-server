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
    classNum: {
      type: String,
      required: true,
    },
    profilPic: {
      type: String,
      default:
        "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg",
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
