const express = require('express');
const ctrl = require('../controllers/auth');
const {validateBody, authenticate}  = require("../middlewares");
const {schemas} = require("../db/models/user");

const router = express.Router();


router.post('/signup', validateBody(schemas.signUpSchema), ctrl.signup);
router.post('/signin', validateBody(schemas.signInSchema), ctrl.signin);
router.post('/signout',authenticate, ctrl.signout);

    
module.exports = router;
