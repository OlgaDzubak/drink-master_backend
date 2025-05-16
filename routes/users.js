const express = require('express');
const ctrl = require('../controllers/users');
const {authenticate, validateBody, upload}  = require("../middlewares");
const { schemas } = require("../db/models/user");

const router = express.Router();


router.get('/current', authenticate, ctrl.getCurrent);
router.patch('/update', authenticate, upload.single("avatar"), ctrl.updateUser);

router.get('/verify/:verificationToken', ctrl.verifyEmail);
router.post('/verify', validateBody(schemas.subscriptionEmailSchema), ctrl.resendVerifyEmail);
router.post('/subscribe', authenticate, ctrl.subscribe);
    
module.exports = router;
