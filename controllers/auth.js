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

//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для реєстрації, авторизації, роза) ----------------------------

// реєстрація нового користувача
  const signup = async (req, res) => {
    
  }

// верифікація електронної пошти юзера  
  const verifyEmail = async(req, res) => {
 
  }


// повторная верифікація електроної пошти користувача
  const resendVerifyEmail = async(req, res) => {
 
  }

// авторизація користувача
  const signin = async (req, res) => {

  }

// розавторизація користувача
  const signout = async (req, res) => {

  }



//---------------------------------------------------------------------------------------------------------

module.exports = {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};

