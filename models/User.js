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
    status: {
      type: String,
      default: "free",
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
    lastExam: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
