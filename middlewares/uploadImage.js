const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().valueOf() + "_" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/.jpeg" ||
    file.mimetype === "image/.png" ||
    file.mimetype === "image/.jpg" ||
    file.mimetype === "image/.gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    console.log("Invalid file type.");
  }
  console.log(file.mimetype)
};
const upload = multer({
  storage: fileStorageEngine,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

module.exports = upload;
