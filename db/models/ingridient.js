const { Schema, model } = require("mongoose");
const joi = require("joi");

const abvRegExp = /^(([1-9]|[1-9][0-9]|1[0-4][0-9]|100)([,-](?=\d)|$))+$/    // ????? перевірити регулярний вираз для поля abv: значення від 0 до 100

// ----- СХЕМИ МОДЕЛІ ДАНИХ КОЛЕКЦІЇ "INGRIDIENTS" -------------------------------------------------------------------
const ingridientSchema = new Schema(
  {
    title:{
      type: String,
      required: [true, 'Set title for ingridient'],
      minlength: 3,
      maxlenght: 40,
    },
    ingredientThumb:{
      type: String,
      required: [true, 'Set ingredientThumb for ingridient'],
    },
    thumb_medium:{
      type: String,
      required: [true, 'Set thumb_medium for ingridient'],  //??? required чи ні
    },
    thumb_small:{
      type: String,
      required: [true, 'Set thumb_small for ingridient'],  //??? required чи ні
    },
    abv:{
      type: String,
      match: abvRegExp,
    },
    alcohol:{
      type: String,
      required: [true, 'Set alcohol marker for ingridient'],
      enum: ["Yes", "No"],
      default: "No",
    },
    description: {
      type: String,
      required: [true, 'Set description for ingridient'],
      minlength: 10,
      maxlenght: 500,
    },
    type:{
      type: String,
      required: [true, 'Set type for ingridient'],
      maxlenght: 30,
    },
    flavour:{
      type: String,
      required: [true, 'Set flavour for ingridient'],
      maxlenght: 50,
    },
    country: {
      type: String,
      required: [true, 'Set country for ingridient'],
      maxlenght: 100,
    },
  },
  {  
      versionKey: false,
      timestamps: true,
  }
);
const Ingridient = model('Ingridient', ingridientSchema);   // створюємо модель Ingridient


// ----- СХЕМИ ВАЛІДАЦІЇ ДАНИХ В ТІЛІ HTTP-запиту ДО КОЛЕКЦІЇ "INGRIDIENTS"-----------------------------------------------------------
const getSchema = joi.object({
});

const addSchema = joi.object({
});


const schemas = {
  getSchema,
  addSchema,

}

module.exports = { Ingridient, schemas, };