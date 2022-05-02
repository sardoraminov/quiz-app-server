const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../dist"));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname} - ${Date.now()}`);
  },
});
const upload = multer({ storage: storage });

module.exports = {upload}