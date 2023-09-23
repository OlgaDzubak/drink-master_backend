const {User} = require("../db/models/user");
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {v4} = require('uuid');
const path = require("path");
require('dotenv').config();

const {SECRET_KEY, BASE_URL} = process.env;

//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для залогіненого юзера) -----------------------------

// + поверення поточного користувача
  const getCurrent = async(req, res) => {
    const { name, email, id} = req.user;
    res.status(200).json({ name, email, id});
  }


// !!!оновлення даних про поточного користувача (можемо оновити або аватар, або ім'я юзера - user profile window)
  //const avatarsDir = path.join(__dirname, "../", "public", "avatars");   //!!!!змінити на cloudinary
  const updateUser  = async(req, res) => {
    
    const {name} = req.body;                                               // забираємо нове ім'я поточного юзера з http-запиту
    const {_id} = req.user;                                                // забираємо id поточного юзера
    const avatarURL = req.file.path;
            
    await User.findByIdAndUpdate(_id, {avatarURL, name}, {new: true}); // оновлюємо поле avatarURL для поточного юзера
        
    res.json({ avatarURL, name});
  }


// ????? оновлення даних про підписку поточного користувача
  const subscribe = async(req, res) => {
  }

//??? надсилання листа з повідомленням про підписку на розсилку
  // const updateAvatar = async(req, res) =>{
  // } 



//---------------------------------------------------------------------------------------------------------

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  subscribe: ctrlWrapper(subscribe),
 // updateAvatar: ctrlWrapper(updateAvatar),
};

