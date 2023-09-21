const { User } = require('../db/models/user'); 
const {Recipe} = require('../db/models/recipe');
const { httpError, ctrlWrapper } = require('../helpers/');

//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ RECIPES ( для маршрута /drinks) ----------------------------

//   const getDrinksForMainPage = async (req, res) => {
//   }

const getDrinksForMainPage = async (req, res) => {
  const userAge = 18;
  const alcoholicFilter = userAge >= 18 ? 'Alcoholic' : 'Non_Alcoholic';

  const categories = ['Ordinary Drink', 'Cocktail', 'Shake', 'Other/Unknow'];

  const drinksForMainPage = {};

  for (const category of categories) {
    let cocktails;

    if (category === 'Other/Unknow') {
      const alreadySelectedCocktails = Object.values(drinksForMainPage)
        .flatMap((cocktailArray) => cocktailArray)
        .map((cocktail) => cocktail.drink);

      
      cocktails = await Recipe.aggregate([
        { $match: { alcoholic: alcoholicFilter, drink: { $nin: alreadySelectedCocktails } } },
        { $sample: { size: 3 } },
        { $project: { _id: 0, drink: 1, drinkThumb: 1 } } 
      ]);
    } else {
      
      cocktails = await Recipe.find({
        category,
        alcoholic: alcoholicFilter,
      })
        .limit(3)
        .select('-_id drink alcoholic drinkThumb');
    }

    drinksForMainPage[category] = cocktails;
  }

  res.json(drinksForMainPage);
};

// const getPopularDrinks = async (req, res) => {
// }
  
const getPopularDrinks = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || !user.favorites || user.favorites.length === 0) {
      const randomDrinks = await Recipe.aggregate([
        { $sample: { size: 9 } },
        { $project: { _id: 0, drink: 1, drinkThumb: 1 } } 
      ]);

      res.status(200).json(randomDrinks);
    } else {
      const userFavorites = user.favorites;
      const favoriteCocktail = await Recipe.findById(userFavorites[0]);
      const category = favoriteCocktail.category;
      const favoriteIngredients = favoriteCocktail.ingredients.map((ingredient) => ingredient.title);

      const similarDrinks = await Recipe.find({
        category: category,
        'ingredients.title': { $in: favoriteIngredients },
        _id: { $nin: userFavorites },
      })
        .limit(9)
        .select('-_id drink drinkThumb'); 

      res.status(200).json(similarDrinks);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при отриманні популярних коктейлів' });
  }
};

  // const searchDrinks = async (req, res) => {
// }

const searchDrinks = async (req, res) => {
  try {
    const userAge = 18;
    const alcoholicFilter = userAge >= 18 ? 'Alcoholic' : 'Non_Alcoholic';
    
    const { category, ingredient, keyword, page, pageSize } = req.query;

    const currentPage = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const skip = (currentPage - 1) * limit;

    const query = {
      $and: [
        category ? { category } : {},
        ingredient ? { 'ingredients.title': ingredient } : {},
        keyword ? {
          $or: [
            { drink: { $regex: keyword, $options: 'i' } },
            { instructions: { $regex: keyword, $options: 'i' } },
            { 'ingredients.title': { $regex: keyword, $options: 'i' } },
          ],
        } : {},
        { alcoholic: alcoholicFilter },
      ],
    };

    const totalResults = await Recipe.countDocuments(query);

    const drinks = await Recipe.find(query)
      .skip(skip)
      .limit(limit)
      .select('-_id drink drinkThumb category ingredients.title');

    res.status(200).json({ drinks, totalResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при пошуку коктейлів' });
  }
};

  const getDrinkById = async (req, res) => {
  }

  const addDrink = async (req, res) => {
  } 

  const deleteDrinkById = async (req, res) => {
  } 

  const getAllDrinks = async(req, res)=>{
  }

  const addDrinkToFavorite = async (req, res) => {
    
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