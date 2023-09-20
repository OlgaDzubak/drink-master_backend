const {Recipes} = require('../db/models/recipes');
const { httpError, ctrlWrapper } = require('../helpers/');


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ RECIPES ( для маршрута /filters) ----------------------------

  const getCategories = async (req, res) => {
  
  }


  const getIngridients = async (req, res) => {

  }

  
  const getGlasses = async (req, res) => {

  }

//---------------------------------------------------------------------------------------------------------

module.exports = {
    getCategories: ctrlWrapper(getCategories),
    getIngridients: ctrlWrapper(getIngridients),
    getGlasses: ctrlWrapper(getGlasses),
}