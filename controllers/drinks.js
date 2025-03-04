const { User } = require('../db/models/user'); 
const { Recipe } = require('../db/models/recipe');
const { httpError, ctrlWrapper} = require('../helpers/');
const { mongoose } = require("mongoose");
const {differenceInYears} = require('date-fns');
const cloudinary = require('cloudinary').v2;


//------ КОНТРОЛЛЕРИ ДЛЯ РОБОТИ ІЗ КОЛЛЕКЦІЄЮ RECIPES ( для маршрута /drinks) ----------------------------


    const getDrinksForMainPage = async (req, res) => {

      const { per_page } = req.query;
        
      console.log(per_page);
      console.log(typeof per_page);
        
      const userBirthDate = req.user.birthdate;
      const currentDate = new Date();
      const userAge = differenceInYears(currentDate, userBirthDate);
      const ageFilter = userAge >= 18;
      const alcoholicFilter = ageFilter ? 'Alcoholic' : 'Non alcoholic';
      const categories = ['Ordinary Drink', 'Cocktail', 'Shake', 'Other/Unknown'];
      const drinksForMainPage = {};

      for (const category of categories) {
        const cocktails = await Recipe.aggregate([
          { $match: { category, alcoholic: ageFilter ? { $in: ['Alcoholic', 'Non alcoholic'] } : 'Non alcoholic' } },
          { $sample: { size: per_page } },
          { $project: { _id: 1, drink: 1, drinkThumb: 1, alcoholic: 1 } }
        ]);

        drinksForMainPage[category] = cocktails;
      }

      res.json(drinksForMainPage);
    };

    const getAllDrinks = async(req, res)=>{ 
      console.log("req.user=", req.user);
      const {id: owner} = req.user;
      const filter = {owner};
      const result = await Recipe.find(filter, {id:1, drink:1, category:1, alcoholic:1, glass:1, description:1, instructions:1, drinkThumb:1, ingredients:1});
      res.json(result);
    }
    
    const getPopularDrinks = async (req, res) => {
    const userBirthDate = req.user.birthdate;
    const currentDate = new Date();
    const ageFilter = differenceInYears(currentDate, userBirthDate) >= 18;

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user || !user.favorites || user.favorites.length === 0) {
      const randomDrinks = await Recipe.aggregate([
        { $sample: { size: 9 } },
        {
          $project: { _id: 1, drink: 1, drinkThumb: 1, category:1, instructions:1, description:1, shortDescription:1, ingredients:1, alcoholic: ageFilter ? 'Alcoholic' : 'Non alcoholic' }
        } 
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
        alcoholic: ageFilter ? { $in: ['Alcoholic', 'Non alcoholic'] } : 'Non alcoholic',
      })
        .limit(9)
        .select('-_id drink drinkThumb category instructions description shortDescription ingredients.title:1 alcoholic'); 

      res.status(200).json(similarDrinks);
        }
    }

    const searchDrinks = async (req, res) => {
  try {
    const userBirthDate = req.user.birthdate;
    const currentDate = new Date();
    const ageFilter = differenceInYears(currentDate, userBirthDate) >= 18;

    const { category, ingredient, keyword, page, per_page } = req.query;

    const currentPage = parseInt(page) || 1;
    const limit = parseInt(per_page) || 10;
    const skip = (currentPage - 1) * limit;

    const alcoholicFilter = ageFilter ? { $in: ['Alcoholic', 'Non alcoholic'] } : 'Non alcoholic';

    const query = {
      $and: [
        category ? { category } : {},
        ingredient ? { 'ingredients.title': { $regex: ingredient, $options: 'i' } } : {},
        keyword ? {
          $or: [
            { drink: { $regex: keyword.replace(' ', '[^\S]'), $options: 'i' } },
            { instructions: { $regex: keyword.replace(' ', '[^\S]'), $options: 'i' } },
            { 'ingredients.title': { $regex: keyword.replace(' ', '[^\S]'), $options: 'i' } },
           ],
         } : {},
         { alcoholic: alcoholicFilter },
          ],
        };

        const totalResults = await Recipe.countDocuments(query);

        const drinks = await Recipe.find(query)
          .skip(skip)
          .limit(limit)
          .select('_id drink drinkThumb category instructions description shortDescription ingredients.title');

        res.status(200).json({ drinks, totalResults });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка при пошуку коктейлів' });
      }
    };

    const getFavoriteDrinks = async (req, res) => {
      const { _id: userId } = req.user;
      const { page, per_page } = req.query;
    //  const currentPage = parseInt(page) && 1;
    //  const limit = parseInt(per_page) && 10;
    //  const skip = (currentPage - 1) * limit;

      try {
        const result = await Recipe.find(
          { users: { $in: [userId] } },
          { id: 1, drink: 1, category: 1, alcoholic: 1, glass: 1, description: 1, shortDescription: 1, instructions: 1, drinkThumb: 1, ingredients: 1 }
        )
          // .skip(skip)
          // .limit(limit);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    const getDrinkById = async (req, res) => {
      const {id} = req.params;
      console.log(id, typeof(id));
      const result = await Recipe.findById(id, {drink:1, category:1, alcoholic:1, glass:1, description:1, shortDescription:1, instructions:1, drinkThumb:1, ingredients:1});
      if (!result) { throw httpError(404, "Not found"); }
      res.json(result);
    }

    const addDrink = async (req, res) => {
      
      let drinkThumb;

      if (!req.file) { throw httpError(400, `Drink photo is required`); } 

      const {_id: owner} = req.user;
      const {ingredients} = req.body;    //забираємо з body строку ingredients, тому що нам треба її распарсити у JSON-формат, та фотку напоя

      // !!!!перевірити чи правильно розпарсюэться ingredients, в якому вигляді воно прийде з фронтенду
      const ingredientsJSON =  JSON.parse(ingredients).map(({title, measure="", _id: ingId})=>{
          const _id = new mongoose.Types.ObjectId(ingId);
          return {title, measure, ingredientId: _id }; 
        });


      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {   
            console.error(error);
            return res.status(500).json({ message: 'Помилка при завантаженні на Cloudinary' });
        }
        const { secure_url: drinkThumb} = result;               
      }).end(req.file.buffer);

      const result = await Recipe.create({
            ...req.body,
            ingredients : ingredientsJSON, 
            drinkThumb, 
            owner
          }
      );    

      if (!result) { 
        throw httpError(400, `Error! Drink with the name '${req.body.drink}' is elready in the list`); // не можна додавати напої з однаковими назвами, схема валідації не пропустить
      } 

      res.status(201).json(result);

    } 

    const addDrinkToFavorite = async (req, res) => {
    const { id } = req.params;     // забираємо з body id паною  
    const { _id: userId } = req.user;
    
    const drink = await Recipe.findById(id);

    if (!drink) {
      throw httpError(404, "Not Found");
    }

    if (!drink.users) {
      drink.users = [];
    }

    const isFavorite = drink.users.includes(userId);

    let result;

    if (isFavorite) {
      throw httpError(409, `${drink.drink} is already in your favorites.`);
    } else {
      result = await Recipe.findByIdAndUpdate(
        drink._id, 
        { $push: { users: userId } },
        { new: true },
      );
    }

    res.status(201).json(result);
    }

    const deleteDrinkById = async (req, res) => {
      const {id: RemovedDrink_id} = req.params;
      const result = await Recipe.findByIdAndDelete({_id : RemovedDrink_id});
      if (!result) { throw httpError(404, "Not found"); }
      res.json({ message : "drink deleted" });
    } 

    const removeDrinkFromFavorite = async (req, res) => {
        const { id } = req.params;
        const { _id: userId } = req.user;

        const drink = await Recipe.findById(id);

        if (!drink) {
          throw httpError(404, "Not Found");
        }

        const isFavorite = drink.users ? drink.users.includes(userId) : true;

        let result;

        if (isFavorite) {
          result = await Recipe.findByIdAndUpdate(
            drink._id,
            {
              $pull: { users: userId },
            },
            { new: true }
          );
        } else {
          throw httpError(403, `${drink.drink} is not in your favorites.`);
        }

        res.json(result);
    };
  


//--------------------------------------------------------------------------------------------------------

module.exports = {
  getDrinksForMainPage : ctrlWrapper(getDrinksForMainPage),
  getPopularDrinks : ctrlWrapper(getPopularDrinks),
  searchDrinks : ctrlWrapper(searchDrinks),
  getDrinkById : ctrlWrapper(getDrinkById),
  addDrink : ctrlWrapper(addDrink),
  deleteDrinkById : ctrlWrapper(deleteDrinkById),
  getAllDrinks : ctrlWrapper(getAllDrinks),
  addDrinkToFavorite : ctrlWrapper(addDrinkToFavorite),
  removeDrinkFromFavorite : ctrlWrapper(removeDrinkFromFavorite),
  getFavoriteDrinks : ctrlWrapper(getFavoriteDrinks),
}
