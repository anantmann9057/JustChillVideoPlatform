import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    var timeStamp = Date.now();
    cb(null, `${timeStamp}_${file.originalname}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fieldSize: 50 * 1024 * 1024 },
});
