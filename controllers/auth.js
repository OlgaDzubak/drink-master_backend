const {User} = require("../db/models/user");
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const {v4} = require('uuid');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require("fs").promises;
const gravatar = require("gravatar");
require('dotenv').config();


const {SECRET_KEY, BASE_URL} = process.env; 

//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для реєстрації, авторизації, розаавторизації) ----------------------------

  const signup = async (req, res) => {

    const {email, password, birthdate: bd_str} = req.body;
    
    const user = await User.findOne({email});
    if (user) {
      throw httpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const bd_Date = Date.parse(bd_str);
    const avatarURL = gravatar.url(email, {s: 50 });
    
    const newUser = await User.create({ ...req.body, 
                                        password: hashPassword, 
                                        birthdate: bd_Date, 
                                        avatarURL});
    
    const payload = { id: newUser._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    
    await User.findByIdAndUpdate(newUser._id, { token }, {new: true});
    
    // ----------------------------------------------------------
    // блок з верифікацією email після реєстрації закоментила, що  залогінитися автоматом одазу після реєстрації
    // const verificationToken = v4();                                                                 // створюэмо токен для верифікації emai
    // const newUser = await User.create({...req.body, password: hashPassword, verificationToken,});   // створюємо нового юзера

    // відправляємо на email юзера лист для верифікації пошти 
    // const verifyEmail = {
    //   to: email,
    //   subject: "Verify email",
    //   html: `<a target="_blank" href="${BASE_URL}/auth/verify/${verificationToken}">Click verify email</a>`
    // };
    // await sendEmail(verifyEmail);
    // ----------------------------------------------------------

    res.status(201).json( {
      token,
      "user": {
        "name": newUser.name,
        "email": newUser.email,
        "avatarURL": newUser.avatarURL,
        "birthdate": newUser.birthdate,
      }
    });
    
  }

  const signin = async (req, res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    
    if (!user) { throw httpError(401, "Email or Password is wrong"); }
    
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword){ throw httpError(401, "Email or Password is wrong"); }

    //if (!user.verify) { throw httpError(401,"Email or password is wrong");}  // перевіряємо чи пройшов email юзера верифікацію

    const payload = { id: user._id }; 
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json( {
      token,
      "user": {
        "name": user.name,
        "email": user.email,
        "avatarURL": user.avatarURL,
        "birthdate": user.birthdate,
      }
    });
  }

  const signout = async (req, res) => {
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(_id, {token: ""});
    if (!user) { throw httpError(401, "Not authorized"); }
    res.status(204).json({});
  }

  const verifyEmail = async(req, res) => {
    const {verificationToken} = req.params;
  
    const user = await User.findOne({verificationToken});
    if (!user) { throw httpError(404, "User not found"); }
  
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});
  
    res.json({message: "Verification successful"})
  }
  
  const resendVerifyEmail = async(req, res) => {
    const {email} = req.body;

    const user = await User.findOne({email});
    if (!user) {throw httpError(401, 'User not found')}
    if (user.verify){ throw httpError(400, 'Verification has already been passed') }
    
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/auth/verify/${user.verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({ message: "Verification email sent" })
  }


module.exports = {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};

