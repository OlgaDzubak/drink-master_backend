const {Recipe} = require('../db/models/recipe');
const { httpError, ctrlWrapper, toUpperCaseFirst } = require('../helpers/');


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ RECIPES ( для маршрута /drinks) ----------------------------

  const getDrinksForMainPage = async (req, res) => {

  }

  const getPopularDrinks = async (req, res) => {
  }

  const searchDrinks = async (req, res) => {

  }

//+ отримання напою за цього _id для поточного(залогіненого) юзера
  const getDrinkById = async (req, res) => {
    const {id} = req.params;
    const result = await Recipe.findById(id);
    if (!result) { throw httpError(404, "Not found"); }
    res.json(result);
  }

//+додавання напою поточним(залогіненим) юзером
  const addDrink = async (req, res) => {
    const {_id: owner} = req.user;
        
    const result = await Recipe.create({...req.body, owner});

    if (!result) { throw httpError(400, `Drink with the name '${name}' is elready in the list`); }
    res.status(201).json(result);
  } 

//+ видалення напою поточним(залогіненим) юзером
  const deleteDrinkById = async (req, res) => {
    const {id} = req.params;
    const result = await Recipe.findByIdAndDelete(id);
    if (!result) { throw httpError(404, "Not found"); }
    res.json({ message : "drink deleted" });
  } 

// отримання всіх напоїв поточного(залогіненого) юзера
  const getAllDrinks = async(req, res)=>{
    // const {id: owner} = req.user;
    
    // const filter = {owner};
    
    // const result = await Recipe.find(filter, "-createdAt -updatedAt").populate("drink");
    // res.json(result);
  }

  const addDrinkToFavorite = async(req, res)=>{
  }

  const removeDrinkFromFavorite = async(req, res)=>{
  }
  
  const getFavoriteDrinks = async(req, res)=>{
  }
//---------------------------------------------------------------------------------------------------------

module.exports = {
  getDrinksForMainPage    :  ctrlWrapper(getDrinksForMainPage),
  getPopularDrinks        :  ctrlWrapper(getPopularDrinks),
  searchDrinks            :  ctrlWrapper(searchDrinks),
  getDrinkById            :  ctrlWrapper(getDrinkById),
  addDrink                :  ctrlWrapper(addDrink),
  deleteDrinkById         :  ctrlWrapper(deleteDrinkById),
  getAllDrinks            :  ctrlWrapper(getAllDrinks),
  addDrinkToFavorite      :  ctrlWrapper(addDrinkToFavorite),
  removeDrinkFromFavorite :  ctrlWrapper(removeDrinkFromFavorite),
  getFavoriteDerinks      :  ctrlWrapper(getFavoriteDrinks),
}