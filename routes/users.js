const express = require('express');
const ctrl = require('../controllers/users');
const {validateBody, authenticate, upload}  = require("../middlewares");
const {schemas} = require("../db/models/user");

const router = express.Router();

// SIGN IN --------------------------------------------------------------------------------------------------------------------------

router.get('/current', authenticate, ctrl.getCurrent);                            // + запит на отримання інформації про поточного користувача
router.patch('/update', authenticate, ()=>{console.log("Before upload"); upload.single("avatar"); console.log("After upload")}, ctrl.updateUser);  // + запит на оновлення профайлу поточного юзера
router.post('/subscribe',authenticate, ctrl.subscribe);                           // + надсилання листа з повідомленням про підписку на розсилку

// ----------------------------------------------------------------------------------------------------------------------------------

    
module.exports = router;
