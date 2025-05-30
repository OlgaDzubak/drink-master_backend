const {User} = require("../db/models/user");
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {v4} = require('uuid');
require('dotenv').config();
const {SECRET_KEY, BASE_URL} = process.env; 

//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для реєстрації, авторизації, розаавторизації) ----------------------------

  const signup = async (req, res) => {

    const {name, email, password, birthdate: bd_str} = req.body;
    
    console.log("req.body", req.body);

    const user = await User.findOne({email});
    if (user) {
      throw httpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const bd_Date = Date.parse(bd_str);
    const avatarURL = "https://res.cloudinary.com/dxvnh0oip/image/upload/v1742159434/avatars/defaultUserAvatar_btmd8l.png";
    const verificationToken = v4();
   
    const newUser = await User.create({ name, 
                                        email,
                                        password: hashPassword, 
                                        birthdate: bd_Date, 
                                        avatarURL,
                                        verificationToken,
                                      });
    
    //надсилаємо лист на адресу email для веріфікації цього імейлу
    const subject = "Drink Master. Request for verification login email";
    const html = `<div>
                    <h1>Hello ${newUser.name}!</h1>

                    <p>You reсeived this message from Drink Master application.</p>
                    
                    <p style="display: inline;">This is the code for email verification:</p>
                    <p style="font-size:18px; font-weight:600;">${newUser.verificationToken}</p>

                    <p style="font-size:16px; font-weight: 600;">Visit our site
                      <span><a href='https://olgadzubak.github.io/drink-master' target='blank' rel="noopener noreferrer" >Drink Master</a></span>
                      and enjoy the biggest coctail collection from our connoisseurs community.
                    </p>
                  </div>`;
    await sendEmail(newUser.email, subject, html);
    
    
    const payload = { id: newUser._id }; 
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({
      token,
      "user": {
        "name": newUser.name,
        "email": newUser.email,
        "avatarURL": newUser.avatarURL,
        "birthdate": newUser.birthdate,
        "subscribeStatus": newUser.subscribeStatus,
        "verify": false,
      }
    });
    
  }

  const signin = async (req, res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    
    if (!user) { throw httpError(401, "Email or Password is wrong"); }
    
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword){ throw httpError(401, "Email or Password is wrong"); }
    
    // перевіряємо чи пройшов email юзера верифікацію, якщо ні, то повторно відправляємо на email юзера лист з токеном верифікації
    if (!user.verify) {
      const subject = "Drink Master. Request for verification login email";
      const html = `<div>

                      <h1>Hello ${user.name}!</h1>

                      <p>You reсeived this message from Drink Master application.</p>
                      
                      <p style="display: inline;">This is the code for email verification:</p>
                      <p style="font-size:18px; font-weight:600;">${user.verificationToken}</p>

                      <p style="font-size:16px; font-weight: 600;">Visit our site
                        <span><a href='https://olgadzubak.github.io/drink-master' target='blank' rel="noopener noreferrer" >Drink Master</a></span>
                        and enjoy the biggest coctail collection from our connoisseurs community.
                      </p>

                    </div>`;
      

      await sendEmail(email, subject, html);
      //throw httpError(403, "Email verification not completed");
    }

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
        "subscribeStatus": user.subscribeStatus,
        "verify": user.verify,
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

