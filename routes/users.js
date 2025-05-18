const express = require('express');
const ctrl = require('../controllers/users');
const {authenticate, validateBody, upload}  = require("../middlewares");
const { schemas } = require("../db/models/user");

const router = express.Router();


router.get('/current', authenticate, ctrl.getCurrent);
router.patch('/update', authenticate, upload.single("avatar"), ctrl.updateUser);
router.post('/verify', ctrl.verifyEmail);
router.post('/subscribe', authenticate, ctrl.subscribe);
router.post('/unsubscribe', authenticate, ctrl.unsubscribe);

module.exports = router;
