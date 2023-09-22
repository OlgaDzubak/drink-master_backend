const { Schema, model } = require("mongoose");
const joi = require("joi");


// ----- СХЕМИ МОДЕЛІ ДАНИХ КОЛЕКЦІЇ "RECIPES" -------------------------------------------------------------------
  
// схема для поля ingredients
  const ingSchema = new Schema(
    { 
        title: {
            type: String,
            required: [true, "Set title of ingridients"],
        },
        measure: {
            type: String,
            maxlenght: 30,
        },
        ingredientId : {
            type: Schema.Types.ObjectId,
            ref: 'Ingridient',
            required: [true, "Set id of ingridients"],
        },
    },
    {  
        versionKey: false,
        timestamps: true,
    }
  );

  const recipeSchema = new Schema(
    {
        drink:{
            type: String,
            required: [true, 'Set drink title for recipe (a string between 2 and 50 characters long)'],
            minlength: 2,
            maxlenght: 50,
            unique: true,
        },
        drinkAlternate:{
            type: String,
            minlength: 2,
            maxlenght: 50,
            default: "Sorry, not specified",
        },
        tags:{
            type: String,
        },
        video:{
            type: String,
            defailt: "Sorry, not specified",
        },
        category:{
            type: String,
            required: [true, 'Set category of drink'],
        },
        IBA:{
            type: String,
            default: "Sorry, not specified",
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
            minlength: 10,
            maxlenght: 500,
        },
        instructionsES:{
            type: String,
            minlength: 10,
            maxlenght: 500,
        },
        instructionsDE:{
            type: String,
            minlength: 10,
            maxlenght: 500,
        },
        instructionsFR:{
            type: String,
            minlength: 10,
            maxlenght: 500,
        },
        instructionsIT:{
            type: String,
            minlength: 10,
            maxlenght: 500,
        },
        instructionsRU:{
            type: String,
            minlength: 10,
            maxlenght: 500,
        },
        instructionsPL:{
            type: String,
            minlength: 10,
            maxlenght: 500,
        },
        instructionsUK:{
            type: String,
            minlength: 10,
            maxlenght: 500,
        },
        drinkThumb:{
            type: String,
            required: [true, 'Set image URL for recipe'],
        },
        ingredients:{
            type : [ingSchema],    // перевірити
            required: [true, 'Set ingredients for recipe'],
            minlength: 1,
            default: undefined,
        },
        shortDescription:{
            type: String,
            minlength: 10,
            maxlenght: 200,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          }
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
    //назва напою
    drink : joi.string().required().min(2).max(50).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required drink field";
                                    break;
                    case "string.empty":
                                    err.message = "drink field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `drink field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `drink field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    //альтернативна назва напою
    drinkAlternate : joi.string().min(2).max(50).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "drinkAlternate field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `drinkAlternate field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `drinkAlternate field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    // video
    video : joi.string().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "video field should not be empty!";
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),  
    IBA : joi.string().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "IBA field should not be empty!";
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }), 
    //категорыя напою
    category : joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required category field";
                                    break;
                    case "string.empty":
                                    err.message = "category field should not be empty!";
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),    
    //опис напою
    description : joi.string().required().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required description field";
                                    break;
                    case "string.empty":
                                    err.message = "description field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `description field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `description field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),

    //інструкція приготування
    instructions : joi.string().required().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required instructions field";
                                    break;
                    case "string.empty":
                                    err.message = "description field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `description field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `description field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    instructionsES : joi.string().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "instructionsES field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `instructionsES field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `instructionsES field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    instructionsDE : joi.string().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "instructionsDE field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `instructionsDE field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `instructionsDE field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    instructionsFR : joi.string().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "instructionsFR field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `instructionsFR field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `instructionsFR field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    instructionsIT : joi.string().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "instructionsIT field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `instructionsIT field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `instructionsIT field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    instructionRU : joi.string().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "instructionRU field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `instructionRU field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `instructionRU field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    instructionsPL : joi.string().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "instructionsPL field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `instructionsPL field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `instructionsPL field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    instructionsUA : joi.string().min(10).max(500).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "instructionsUA field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `instructionsUA field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `instructionsUA field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),

    //поле алкогольний або безалкогольний
    alcoholic : joi.string().required().valid("Alcoholic","Non alcoholic").error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required alcoholic field";
                                    break;
                    case "string.empty":
                                    err.message = "alcoholic field should not be empty!";
                                    break;
                    case "any.invalid":
                                    err.message = `alcoholic field should contain string "Alcoholic" or "Non alcoholic"!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),
    //поле glass-тип эмності для напою
    glass : joi.string().required().error(errors => {
    errors.forEach(err => {
        switch (err.code) {
                case "any.required": 
                                err.message = "missing required glass field";
                                break;
                case "string.empty":
                                err.message = "glass field should not be empty!";
                                break;
            }
    });
    return errors;
    }),
    drinkThumb : joi.string().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "drinkThumb field should not be empty!";
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }), 
    //масив інгрідієнтів для приготування
    ingredients : joi.array().required().min(1).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required ingredients field";
                                    break;
                    case "array.min":
                                    err.message = "ingredients field should not be empty!";
                                    break;
                }
        });
        return errors;
        }),
    shortDescription : joi.string().min(10).max(200).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "shortDescription field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `shortDescription field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `shortDescription field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),

});

const ingAddSchema = joi.object({

});


const schemas = {
  getSchema,
  addSchema,
}

module.exports = { Recipe, schemas, };