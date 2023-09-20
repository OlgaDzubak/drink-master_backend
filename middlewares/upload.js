const multer = require('multer');                                   //підключаємо бібліотеку multer
const path = require('path');                                       //підключаємо бібліотеку path

const tempDir = path.join(__dirname, "../", "temp");                //створюємо шлях до папки temp, де будуть тимчасово зберігатися файли, що завантажуються

const multerConfig = multer.diskStorage({                           //створюємо налаштування для multer
  destination: (req, file, cb) => { cb(null, tempDir); },
  filename: (req, file, cb) => { cb(null, file.originalname); },
  limits: { fileSize: 1048576, },
});

const upload = multer({ storage: multerConfig });                   //створюємо middleware upload

module.exports = upload;