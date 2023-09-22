const express = require('express');
const ctrl = require('../controllers/drinks');
const {validateBody, validateId, validateFavorite, validateQuery, authenticate}  = require("../middlewares");
const {schemas} = require("../db/models/recipe");
const router = express.Router();


router
    .route('/mainpage')
    .get(authenticate, ctrl.getDrinksForMainPage);

router
    .route('/popular')
    .get(authenticate, ctrl.getPopularDrinks);

router
    .route('/search')
    .get(authenticate, ctrl.searchDrinks);

router
    .route('/:id')
    .get(authenticate, validateId, ctrl.getDrinkById)
    .delete(authenticate, validateId, ctrl.deleteDrinkById);

router
    .route('/own')
    .get(authenticate, ctrl.getAllDrinks);

router
    .route('/own/add')
    .post(authenticate, validateBody(schemas.addSchema), ctrl.addDrink);


    



// router
//     .route('/favorite/add')
//     .post(authenticate, validateId, ctrl.addDrinkToFavorite) 

// router
//     .route('/favorite/remove')
//     .delete(authenticate, validateId, ctrl.removeDrinkFromFavorite)    

// router
//     .route('/favorite')
//     .get(authenticate, ctrl.getFavoriteDrinks)




module.exports = router;
