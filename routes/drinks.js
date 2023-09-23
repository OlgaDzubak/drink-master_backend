const express = require('express');
const ctrl = require('../controllers/drinks');
const {validateBody, validateId, validateFavorite, validateQuery, validateFormData, authenticate, upload}  = require("../middlewares");
const {schemas} = require("../db/models/recipe");
const router = express.Router();

router.get('/mainpage', authenticate, ctrl.getDrinksForMainPage);                   //+
router.get('/own', authenticate, ctrl.getAllDrinks);                                //+
router.get('/popular', authenticate, ctrl.getPopularDrinks);
router.get('/search', authenticate, ctrl.searchDrinks);
router.get('/favorite', authenticate, ctrl.getFavoriteDrinks);
router.get('/:id', authenticate, validateId, ctrl.getDrinkById);                    //+

router.post('/own/add', authenticate, upload.single("drinkImage"), ctrl.addDrink);  //+
router.post('/favorite/add/:id', authenticate, validateId,ctrl.addDrinkToFavorite);

router.delete('/:id', authenticate, validateId, ctrl.deleteDrinkById);   
router.delete('/favorite/remove/:id', authenticate, validateId, ctrl.removeDrinkFromFavorite);



module.exports = router;
