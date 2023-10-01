console.log("я в начале upload");

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

console.log("я в начале upload после require('multer');");



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log("я в upload после loudinary.config");

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
      public_id: file.originalname,    // Use original filename as the public ID
      transformation: [
        { height: 350, crop: "scale" },
        { height: 700, crop: "scale" },
      ],
    };
  },
});

console.log("я в upload перед  multer({ storage });");
const upload = multer({ storage });

console.log("я в upload после  multer({ storage });");
module.exports = upload;
