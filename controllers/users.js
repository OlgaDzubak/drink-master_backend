const {User} = require("../db/models/user");
const {ctrlWrapper, sendEmail } = require('../helpers');
const {v4} = require('uuid');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const path = require("path");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const {SECRET_KEY, BASE_URL} = process.env;


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для залогіненого юзера) -----------------------------

  const getCurrent = async(req, res) => {
    const {id, name, email, avatarURL} = req.user;
    res.status(200).json({id, name, email, avatarURL});
  }

  const updateUser  = async(req, res) => {

    let newUserName, newAvatarURL;
    
    const {_id, name: currentUserName} = req.user;
    const {name} = req.body;

    if (!name) { newUserName = currentUserName}
    else { newUserName = name};
    
    if (!req.file)
      {                                         
        const usr = await User.findByIdAndUpdate(_id, {name: newUserName}, {new: true});
        res.json({ name: usr.name, avatarURL: usr.avatarURL});   
      }
    else
      {
        
        newAvatarURL = req.file.path;

        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {   
              console.error(error);
              return res.status(500).json({ message: 'Помилка при завантаженні на Cloudinary' });
          }
          const { secure_url: newAvatarURL} = result;
        
        }).end(req.file.buffer);

        const usr = await User.findByIdAndUpdate(_id, {name: newUserName, avatarURL: newAvatarURL}, {new: true});
          
        res.json({name: usr.name , avatarURL: usr.avatarURL });
      }                
  }

  const subscribe = async(req, res) => {
      const {email, name} = req.user;
       
      // створюємо поштове повідомлення
       const EmailAboutSubscription = {
        to: email,
        subject: `Subscription message from ${BASE_URL}`,
        html: ` <h1 style="font-size: 20px"> Hello, ${name}!</h1>
                <p  style="font-size: 16px"> You are subscribed to our newsletters. </p>
                <p  style="font-size: 16px"> You will recieve letters about our news and special offers, etc. </p>
                <p  style="font-size: 16px"> Thank you! </p>

                <p  style="font-size: 14px"> Visit our site! 
                  <a target="_blank" href="https://dimachernyaev.github.io/drinkMaster-Team-1" style="font-size: 20px; font-wight:bolt">Drink Master web-site</a>
                </p>`
      };
      
      // відправляємо на email юзера лист з повіломленням про підписку
      await sendEmail(EmailAboutSubscription);

      res.json( { message: `Subscribtion successful. Letters about subscribtion was sent to your email ${email}` } );

  }


module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  subscribe: ctrlWrapper(subscribe),
 // updateAvatar: ctrlWrapper(updateAvatar),
};

