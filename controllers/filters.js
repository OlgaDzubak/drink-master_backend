const {Recipe} = require('../db/models/recipe');
const {Ingridient} = require('../db/models/ingridient');
const { ctrlWrapper } = require('../helpers/');


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ RECIPES ( для маршрута /filters) ----------------------------

  //+ отримання списку категорій із колекції recipes
  const getCategories = async (req, res) => {
    const result = await Recipe.distinct("category");
    res.json(result);
  }

  //+отримання списку інгрідієнтів із колекції шngridients
  const getIngridients = async (req, res) => {
    const result = await Ingridient.distinct("title");
    res.json(result);
  }

  //+ отримання списку ємностей для напоїв із колекції recipes
  const getGlasses = async (req, res) => {
    const result = await Recipe.distinct("glass");
    res.json(result);
  }

//---------------------------------------------------------------------------------------------------------

module.exports = {
    getCategories: ctrlWrapper(getCategories),
    getIngridients: ctrlWrapper(getIngridients),
    getGlasses: ctrlWrapper(getGlasses),
}