const {User} = require("../db/models/user");
const { ctrlWrapper } = require('../helpers');
require('dotenv').config();
// const nodemailer = require("nodemailer");
// const {NODEMAILER_EMAIL, NODEMAILER_PASS} = process.env;


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для залогіненого юзера) -----------------------------

  const getCurrent = async(req, res) => {
    const {id, name, email, avatarURL} = req.user;
    res.status(200).json({id, name, email, avatarURL});
  }

  const updateUser  = async(req, res) => {

    if (req.fileValidationError){
      throw httpError(422, "Wrong file format.");
    }

    let newUserName, newAvatarURL, usr;
    
    const {_id, name: currentUserName} = req.user;
    const {name} = req.body;

    if (!name) { newUserName = currentUserName}
    else { newUserName = name};
    
    if (!req.file)
      {                                         
        usr = await User.findByIdAndUpdate(_id, {name: newUserName}, {new: true});
      }
    else{
        newAvatarURL = req.file.path;
        usr = await User.findByIdAndUpdate(_id, {name: newUserName, avatarURL: newAvatarURL}, {new: true});
      } 

      res.json({name: usr.name , avatarURL: usr.avatarURL });               
}
  
  const verifyEmail = async(req, res) => {

    const { verificationToken } = req.body;

    const user = await User.findOne({verificationToken});
    if (!user) { throw httpError(404, "User not found"); }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
    
    res.json({ message: "Verification successful" });
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

  const subscribe = async (req, res) => {
    
    const {email, name} = req.user;
    const { subscriptionEmail } = req.body;

    
    res.json({
      subscriptionEmail,
      message: `Subscription successful. Letters about subscription was sent to your email ${subscriptionEmail}`
    });

  

  }


module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  subscribe: ctrlWrapper(subscribe),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};

