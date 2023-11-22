const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const absolutePath = path.resolve(__dirname, '../../storage/imgs/');
    cb(null, absolutePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const extension = path.extname(file.originalname);
    const relativePath = path.join('storage', 'imgs', `${file.fieldname}-${uniqueSuffix}${extension}`);
    const publicFolderPath = path.resolve(__dirname, '../');
    const relativeToPublic = path.relative(publicFolderPath, relativePath);
    cb(null, relativeToPublic);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;


