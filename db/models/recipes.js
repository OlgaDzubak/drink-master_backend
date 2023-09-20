const { Schema, model } = require("mongoose");
const joi = require("joi");


// ----- СХЕМИ МОДЕЛІ ДАНИХ КОЛЕКЦІЇ "RECIPES" -------------------------------------------------------------------
  
// схема для поля ingredients
  const ingSchema = new Schema(
    { 
        title: {
            type: String,
            required: true,
        },
        measure: {
            type: String,
            required: true,
            maxlenght: 30,
        },
        ingredientId : {
            type: Schema.Types.ObjectId,
            required: true,
        },
    }
  );

  const recipeSchema = new Schema(
    {
        drink:{
            type: String,
            required: [true, 'Set drink title for recipe'],
            minlength: 2,
            maxlenght: 50,
        },
        drinkAlternate:{
            type: String,
            minlength: 2,
            maxlenght: 50,
        },
        tags:{
            type: String,
        },
        video:{
            type: String,
        },
        category:{
            type: String,
        },
        IBA:{
            type: String,
        },
        alcoholic:{
            type: String,
            required: [true, 'Set alcoholic marker for recipe'],
            enum : ["Alcoholic","Non alcoholic"],
        },
        glass:{
            type: String,
            required: [true, 'Set type of glass for recipe'],
            minlength: 2,
            maxlenght: 20,
        },
        description:{            
            type: String,
            required: [true, 'Set description for recipe'],
            minlength: 10,
            maxlenght: 500,
        },
        instructions:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 20,
            maxlenght: 500,
        },
        instructionsES:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 20,
            maxlenght: 500,
        },
        instructionsDE:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 20,
            maxlenght: 500,
        },
        instructionsFR:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 20,
            maxlenght: 500,
        },
        instructionsIT:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 20,
            maxlenght: 500,
        },
        instructionsRU:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 20,
            maxlenght: 500,
        },
        instructionsPL:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 20,
            maxlenght: 500,
        },
        instructionsUK:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 20,
            maxlenght: 500,
        },
        drinkThumb:{
            type: String,
            required: [true, 'Set image URL for recipe'],
        },
        ingredients:{
            type : [ingSchema],    // перевірити
            default: undefined,
        },
        shortDescription:{
            type: String,
            required: [true, 'Set instructions for recipe'],
            minlength: 10,
            maxlenght: 200,
        },
    },
    {  
        versionKey: false,
        timestamps: true,
    }
  );

  const Recipe = model('Recipe', recipeSchema);   // створюємо модель Recipe






// ----- СХЕМИ ВАЛІДАЦІЇ ДАНИХ В ТІЛІ HTTP-запиту КОЛЕКЦІЇ "RECIPES"-----------------------------------------------------------

const getSchema = joi.object({
});

const addSchema = joi.object({
    
});


const schemas = {
  getSchema,
  addSchema,
}

module.exports = { Recipe, schemas, };