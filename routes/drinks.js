const express = require('express');
const ctrl = require('../controllers/drinks');
const {validateId, validateBody, authenticate, upload}  = require("../middlewares");
const {schemas} = require("../db/models/recipe");
const router = express.Router();



router.get('/mainpage', authenticate, ctrl.getDrinksForMainPage);
router.get('/own', authenticate, ctrl.getAllDrinks);
router.get('/popular', authenticate, ctrl.getPopularDrinks);
router.get('/search', authenticate, ctrl.searchDrinks);
router.get('/favorite', authenticate, ctrl.getFavoriteDrinks);
router.get('/:id', validateId, ctrl.getDrinkById);

router.post('/own/add', authenticate, validateBody(schemas.addSchema), upload.single("drinkThumb"), ctrl.addDrink);
router.post('/favorite/add/:id', authenticate, validateId, ctrl.addDrinkToFavorite);

router.delete('/own/remove/:id', authenticate, validateId, ctrl.deleteDrinkById);
router.delete('/favorite/remove/:id', authenticate, validateId, ctrl.removeDrinkFromFavorite);


module.exports = router;
