const {User} = require("../db/models/user");
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {v4} = require('uuid');

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
    const avatarURL = "https://res.cloudinary.com/dxvnh0oip/image/upload/v1742159434/avatars/defaultUserAvatar_btmd8l.png";
    const verificationToken = v4();
   
    const newUser = await User.create({ ...req.body, 
                                        password: hashPassword, 
                                        birthdate: bd_Date, 
                                        avatarURL,
                                        verificationToken});
    
    //надсилаємо лист на адресу email для веріфікації цього імейлу
    const subject = "Drink Master. Request for verification login email";
    const html = `<p>This is the code for email verification ${verificationToken}</p>`;
    // const html = `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Verify email</a>`;
    await sendEmail(email, subject, html);
    
    res.status(201).json( {
      "user": {
        "name": newUser.name,
        "email": newUser.email,
        "avatarURL": newUser.avatarURL,
        "birthdate": newUser.birthdate,
        "subscribeStatus": newUser.subscribeStatus,
      }
    });
    
  }

  const signin = async (req, res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    
    if (!user) { throw httpError(401, "Email or Password is wrong"); }
    
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword){ throw httpError(401, "Email or Password is wrong"); }

    // if (!user.verify) { throw httpError(401,"Email or password is wrong");}  // перевіряємо чи пройшов email юзера верифікацію

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
        "subscribeStatus": newUser.subscribeStatus,
      }
    });
  }

  const signout = async (req, res) => {
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(_id, {token: ""});
    if (!user) { throw httpError(401, "Not authorized"); }
    res.status(204).json({});
  }



module.exports = {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
};

