const {User} = require("../db/models/user");
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
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
    
  const subscribe = async (req, res) => {

    const { _id } = req.user;
    
    let user = await User.findById(_id);
    if (!user) { throw httpError(401, "Not authorized"); }
    if (!user.verify) { throw httpError(403, "Email is not verified") }
    user = await User.findByIdAndUpdate(_id, { subscribeStatus: true });

    const subject = "Drink Master. Subscription activated.";
    const html = `<h1>Hello ${user.name}!</h1>
                  <p>You reсeived this message from Drink Master application</p>
                  <p>Your subscription activated. You will be in touch with latest news and our special offers</p>
                  <p>Visit our site
                    <span>
                      <a href='https://olgadzubak.github.io/drink-master' target='blank' noopener noreferrer >Drink Master</a>
                    </span>
                    and enjoy the biggest coctail collection from our connoisseurs community.
                  </p>`;
    await sendEmail(user.email, subject, html);

    res.status(200).json({
      email: user.email,
      message: `Subscription successful. Letters about subscription was sent to your email ${user.email}`
    });
  }

  const unsubscribe = async (req, res) => {
    
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, {subscribeStatus: false});
    if (!user) { throw httpError(401, "Not authorized"); }       

    const subject = "Drink Master. Subscription canceled.";
    const html = `<h1>Hello ${user.name}!</h1>
                  <p>You reсeived this message from Drink Master application</p>
                  <p>Your subscription canceled</p>
                  <p>To activate subscription again visit our site
                    <span>
                      <a href='https://olgadzubak.github.io/drink-master' target='blank' noopener noreferrer >Drink Master</a>
                    </span>
                  </p>
                  <p>Enjoy the biggest coctail collection from our connoisseurs community.</p>`;

      ;
    await sendEmail(user.email, subject, html);

    res.status(200).json({
      email: user.email,
      message: 'Subscription canceled'
    });
}
  
module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  verifyEmail: ctrlWrapper(verifyEmail),
  subscribe: ctrlWrapper(subscribe),
  unsubscribe: ctrlWrapper(unsubscribe),  
};

