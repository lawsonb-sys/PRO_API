const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // cb(null, file.originalname);
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

var upload = multer({
  storage: storage,
  /*  fileFilter: function (req, file, callback) {
    if (file.mimetype == "photo/png" || file.mimetype == "photo/jpg") {
      callback(null, true);
    } else {
      console.log("only jpg and png suport");
      callback(null, false);
    }
  },*/
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = upload;
