const express = require('express');
const ctrl = require('../controllers/users');
const {validateBody, authenticate, upload}  = require("../middlewares");
const {schemas} = require("../db/models/user");

const router = express.Router();


// МАРШРУТИ ДЛЯ ЗАЛОГІНЕНОГО ЮЗЕРА
router
    .route('/current')
    .get(authenticate, ctrl.getCurrent);                             //запит на отримання інформації про поточного користувача

router
    .route('/update')
    .patch(authenticate, validateBody(schemas.updateSchema), ctrl.updateUser); //запит на оновлення даних про користувача

router
    .route('/sibscribe')
    .post(authenticate, ctrl.subscribe);   //запит на надсилання листа з повідомленням про підписку на розсилку



module.exports = router;