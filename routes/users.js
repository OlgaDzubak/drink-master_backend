const express = require('express');
const ctrl = require('../controllers/users');
const {authenticate, upload}  = require("../middlewares");

const router = express.Router();


router.get('/current', authenticate, ctrl.getCurrent);
router.patch('/update', authenticate, upload.single("avatar"), ctrl.updateUser);
router.post('/verify', ctrl.verifyEmail);
router.post('/subscribe', authenticate, ctrl.subscribe);
router.post('/unsubscribe', authenticate, ctrl.unsubscribe);

module.exports = router;
