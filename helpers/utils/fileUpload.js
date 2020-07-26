const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  // multers disk storage settings
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../data/uploads'));
  },
  filename(req, file, cb) {
    const datetimestamp = Date.now();
    cb(
      null,
      `${file.fieldname
      }-${
        datetimestamp
      }.${
        file.originalname.split('.')[file.originalname.split('.').length - 1]}`,
    );
  },
});

const upload = multer({
  // multer settings
  storage,
  fileFilter(req, file, callback) {
    // file filter
    if (
      ['xls', 'xlsx'].indexOf(
        file.originalname.split('.')[file.originalname.split('.').length - 1],
      ) === -1
    ) {
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  },
}).single('file');

module.exports = upload;
