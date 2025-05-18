const {User} = require("../db/models/user");
const {httpError, ctrlWrapper } = require('../helpers');
require('dotenv').config();



//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ USERS (для залогіненого юзера) -----------------------------

  const getCurrent = async(req, res) => {
    const {id, name, email, avatarURL, birthdate, subscribeStatus, verify} = req.user;
    res.status(200).json({id, name, email, avatarURL, birthdate, subscribeStatus, verify});
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
    if (!user) { throw httpError(403, "Verification failed"); }

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

    const { _id } = req.user;
    
    const user = await User.findById(_id);
    if (!user) { throw httpError(401, "Not authorized"); }
    if (!user.verify) { throw httpError(403, "Email is not verified") }
    const newUser = await User.findByIdAndUpdate(_id, {subscribeStatus: true});
       
    res.status(200).json({
      email: newUser.email,
      message: `Subscription successful. Letters about subscription was sent to your email ${newUser.email}`
    });
  }

  const unsubscribe = async (req, res) => {
    
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, {subscribeStatus: false});
    if (!user) { throw httpError(401, "Not authorized"); }       

    res.status(200).json({
      email: user.email,
      message: 'Subscription is canceled'
    });
}
  
module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  subscribe: ctrlWrapper(subscribe),
  unsubscribe: ctrlWrapper(unsubscribe),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};

