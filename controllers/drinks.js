const {Recipes} = require('../db/models/recipes');
const { httpError, ctrlWrapper } = require('../helpers/');


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ RECIPES ( для маршрута /drinks) ----------------------------

  const getDrinksForMainPage = async (req, res) => {
  }

  const getPopularDrinks = async (req, res) => {
  }

  const searchDrinks = async (req, res) => {
  }

  const getDrinkById = async (req, res) => {
  }

  const addDrink = async (req, res) => {
  } 

  const deleteDrinkById = async (req, res) => {
  } 

  const getAllDrinks = async(req, res)=>{
  }

  const addDrinkToFavorite = async(req, res)=>{
  }

  const removeDrinkFromFavorite = async(req, res)=>{
  }
  
  const getFavoriteDerinks = async(req, res)=>{
  }
//---------------------------------------------------------------------------------------------------------

module.exports = {
  getDrinksForMainPage :  ctrlWrapper(getDrinksForMainPage),
  getPopularDrinks :  ctrlWrapper(getPopularDrinks),
  searchDrinks:  ctrlWrapper(searchDrinks),
  getDrinkById:  ctrlWrapper(getDrinkById),
  addDrink:  ctrlWrapper(addDrink),
  deleteDrinkById: ctrlWrapper(deleteDrinkById),
  getAllDrinks:  ctrlWrapper(getAllDrinks),
  addDrinkToFavorite:  ctrlWrapper(addDrinkToFavorite),
  removeDrinkFromFavorite:  ctrlWrapper(removeDrinkFromFavorite),
  getFavoriteDerinks:  ctrlWrapper(getFavoriteDerinks),
}