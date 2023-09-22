// const multer = require('multer');                                   //підключаємо бібліотеку multer
// const path = require('path');                                       //підключаємо бібліотеку path

// const tempDir = path.join(__dirname, "../", "temp");                //створюємо шлях до папки temp, де будуть тимчасово зберігатися файли, що завантажуються

// const multerConfig = multer.diskStorage({                           //створюємо налаштування для multer
//   destination: (req, file, cb) => { cb(null, tempDir); },
//   filename: (req, file, cb) => { cb(null, file.originalname); },
//   limits: { fileSize: 1048576, },
// });

// const upload = multer({ storage: multerConfig });                   //створюємо middleware upload

// module.exports = upload;



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on file properties or request data
    let folder;
    if (file.fieldname === 'avatar') {
      folder = 'avatars';
    } else if (file.fieldname === "drink") {
      folder = "drinks";
    } else {
      folder = "others";
    }
    return {
      folder: folder,
      allowed_formats: ["jpg", "png"], // Adjust the allowed formats as needed
      public_id: file.originalname, // Use original filename as the public ID
      transformation: [
        { width: 350, height: 350 },
        { width: 700, height: 700 },
      ],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
