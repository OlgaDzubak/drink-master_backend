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

const {v2:cloudinary} = require('cloudinary');
          
cloudinary.config({ 
  cloud_name: 'dxvnh0oip', 
  api_key: '855496256414967', 
  api_secret: '***************************' 
});


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для залогіненого юзера) -----------------------------

// поверення поточного користувача
  const getCurrent = async(req, res) => {
    const { name, email } = req.user;
    res.status(200).json({ name, email });
  }


// оновлення даних про поточного користувача
  const updateUser  = async(req, res) => {

  }


// ????? оновлення даних про підписку поточного користувача
  const subscribe = async(req, res) => {

  }

// надсилання листа з повідомленням про підписку на розсилку
  const updateAvatar = async(req, res) =>{

  }



//---------------------------------------------------------------------------------------------------------

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  subscribe: ctrlWrapper(subscribe),
  updateAvatar: ctrlWrapper(updateAvatar),
};

