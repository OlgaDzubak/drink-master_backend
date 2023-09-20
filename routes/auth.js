const express = require('express');
const ctrl = require('../controllers/auth');
const {validateBody, authenticate, upload}  = require("../middlewares");
const {schemas} = require("../db/models/user");

const router = express.Router();


// SIGN UP
router
    .route('/signup')
    .post(validateBody(schemas.signUpSchema), ctrl.signup);          //запит на реєстрацію нового користувача

router
    .route('/verify/:verificationToken')
    .get(ctrl.verifyEmail);                                          // запит на верифікацію єлектронної пошти юзера   

router
    .route('/verify')
    .post(validateBody(schemas.emailSchema), ctrl.resendVerifyEmail);// запит на повторну верифікацію єлектронної пошти юзера


// SIGN IN
router
.   route('/sighin')
    .post(validateBody(schemas.signInSchema), ctrl.signin);           //запит на авторизацію існуючого користувача

router
    .route('/signout')
    .post(authenticate, ctrl.signout);                                 //запит на розавторизацію існуючого користувача


    
module.exports = router;