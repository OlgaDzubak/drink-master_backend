const {Recipe} = require('../db/models/recipe');
const {Ingredient} = require('../db/models/ingredient');
const { ctrlWrapper } = require('../helpers/');


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ RECIPES ТА INFEIDIENRS (для маршрута /filters) --------------

  const getCategories = async (req, res) => {
    const result = await Recipe.distinct("category");
    res.json(result);
  }

  const getIngredients = async (req, res) => {
   // const result = await Ingredient.distinct("title");
     const result = await Ingredient.find().select('_id title ingredientThumb');
    res.json(result);
  }

  const getGlasses = async (req, res) => {
    const result = await Recipe.distinct("glass");
    res.json(result);
  }


module.exports = {
    getCategories: ctrlWrapper(getCategories),
    getIngredients: ctrlWrapper(getIngredients),
    getGlasses: ctrlWrapper(getGlasses),
}
