const {User} = require("../db/models/user");
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {v4} = require('uuid');
const path = require("path");
require('dotenv').config();

const {SECRET_KEY, BASE_URL} = process.env;

//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для залогіненого юзера) -----------------------------

//+ поверення поточного користувача
  const getCurrent = async(req, res) => {
    const { name, email, id} = req.user;
    res.status(200).json({id, name, email, avatarURL});
  }


//+ оновлення даних про поточного користувача (можемо оновити або аватар, або ім'я юзера - user profile window)
  //const avatarsDir = path.join(__dirname, "../", "public", "avatars");   //!!!!змінити на cloudinary
  const updateUser  = async(req, res) => {
    let newAvatarURL;
    
    const {name} = req.body;                                               // забираємо нове ім'я поточного юзера з http-запиту
    const {_id, avatarURL} = req.user;                                     // забираємо id поточного юзера
    
    if (req.file) { newAvatarURL = req.file.path; }
    else { newAvatarURL =avatarURL; }
    
    await User.findByIdAndUpdate(_id, {avatarURL:newAvatarURL , name}, {new: true}); // оновлюємо поле avatarURL для поточного юзера
        
    res.json({ avatarURL, name});
  }


//+ надсилання листа з повідомленням про підписку на розсилку
  const subscribe = async(req, res) => {
      const {email, name} = req.user;
       
      // створюємо поштове повідомлення
       const EmailAboutSubscription = {
        to: email,
        subject: `Subscription message from ${BASE_URL}`,
        html: ` <h1 style="font-size: 20px"> Hello, ${name}!</h1>
                <p  style="font-size: 16px"> You are subscribed to our newsletters. </p>
                <p  style="font-size: 16px"> You will be recieve a letters about our news and special offers, etc. </p>
                <p  style="font-size: 16px"> Thank you! </p>

                <p  style="font-size: 14px"> Visit out site! 
                  <a target="_blank" href="${BASE_URL}" style="font-size: 20px; font-wight:bolt">Drink Master web-site</a>
                </p>`
      };
      
      // відправляємо на email юзера лист з повіломленням про підписку
      await sendEmail(EmailAboutSubscription);

      res.json( { message: `Subscribtion successful. Letters about subscribtion was sent to your email ${email}` } );

  }



//---------------------------------------------------------------------------------------------------------

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  subscribe: ctrlWrapper(subscribe),
 // updateAvatar: ctrlWrapper(updateAvatar),
};

