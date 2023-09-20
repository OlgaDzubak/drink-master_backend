const express = require('express');
const ctrl = require('../controllers/filters');
const {authenticate}  = require("../middlewares");

const router = express.Router();


router
    .route('/categories')
    .get(authenticate, ctrl.getCategories)

router
    .route('/ingridients')
    .get(authenticate, ctrl.getIngridients)

router
    .route('/glasses')
    .patch(authenticate, ctrl.getGlasses);

module.exports = router;
