const {User} = require("../db/models/user");
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const jimp = require('jimp');
const {v4} = require('uuid');
const path = require("path");
const fs = require("fs").promises;
require('dotenv').config();

const {SECRET_KEY, BASE_URL} = process.env;

// const {v2:cloudinary} = require('cloudinary');
          
// cloudinary.config({ 
//   cloud_name: 'dxvnh0oip', 
//   api_key: '855496256414967', 
//   api_secret: '***************************' 
// }); 


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для залогіненого юзера) -----------------------------

// + поверення поточного користувача
  const getCurrent = async(req, res) => {
    const { name, email } = req.user;
    res.status(200).json({ name, email });
  }


// !!!оновлення даних про поточного користувача (можемо оновити або аватар, або ім'я юзера - user profile window)
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");   //!!!!змінити на cloudinary
  
  const updateUser  = async(req, res) => {
    
    //const {name} = req.file;
    //const { _id } = req.user;                                  // забираємо id поточного юзера з http-запиту
    
    //оновлення ім'я користувача
   // console.log("name = ", name);
    // if (name){
    //   await User.findByIdAndUpdate(_id, {name});
    //   //resData = {name};
    // }

    //оновлення аватара користувача
    // const { path: tempUpLoad, originalname } = req.file;       // забираємо шлях та ім'я файла-аватара з http-запиту
    // console.log("path = ", path);

    //     const fileName = `${_id}_${originalname}`;                 // формуємо нову назву файла-аватара, включаючи в нього id поточного юзера

    //     // Змінюємо розмір аватара в тимчасовій папці за допомогою пакету jimp
    //     const temp_avatar = await jimp.read(tempUpLoad);                  // прочитали зображення
    //     await temp_avatar.resize(250, 250).writeAsync(tempUpLoad)         // змінили розмір зображення на 250х250 та перезаписали зображення поверх початкового
        
    //     // переміщуємо аватар на постійне місце розташування
    //     const resultUpload = path.join(avatarsDir, fileName);      // повний шлях до постійного розташування файлу аватара
    //     await fs.rename(tempUpLoad, resultUpload);                 // переіменовуємо файл аватара, та переміщаємо йього на постійне місце розташування
    //     const avatarURL = path.join("avatars", fileName);          // формуємо відносний шлях до файлу аватара avatars/originalname для занесення в БД
    //     await User.findByIdAndUpdate(_id, {avatarURL});            // оновлюємо поле avatarURL для поточного юзера
    //     //resData = {avatarURL,};
    
    //   res.json();

  }


// ????? оновлення даних про підписку поточного користувача
  const subscribe = async(req, res) => {

  }

//??? надсилання листа з повідомленням про підписку на розсилку
  const updateAvatar = async(req, res) =>{

  } 



//---------------------------------------------------------------------------------------------------------

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  subscribe: ctrlWrapper(subscribe),
  updateAvatar: ctrlWrapper(updateAvatar),
};

