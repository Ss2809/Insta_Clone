const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/post");
  },
  filename: (req, file, cb) => {
    const uniquename = Date.now() + "-" + file.originalname;
    cb(null, uniquename);
  },
});

const fileFilter = (req, file, cb) => {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/mov",
  ];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid format types of media"), false);
  }
};
const upload = multer({
  storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

module.exports = upload;
