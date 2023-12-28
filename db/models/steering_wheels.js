const { Schema, model } = require("mongoose");
const joi = require("joi");

const SW_Schema = new Schema(
    {
        name:{
            type: String,
            required: [true, 'Set title for photo (a string between 2 and 50 characters long)'],
            minlength: 2,
            maxlenght: 50,
            unique: true,
        },
        car_brand:{
            type: String,
            maxlenght: 20,
        },
        photo_url:{            
            type: String,
            required: [true, 'Set url for recipe photo'],
            minlength: 10,
            maxlenght: 500,
        },
        material:{
            type: String,
            required: [true, 'Set type of material'],
            minlength: 3,
            maxlenght: 50,
        },
        photo_description:{
            type: String,
            required: [true, 'Set description for photo'],
            minlength: 10,
            maxlenght: 500,
        },
    },
    {  
        versionKey: false,
        timestamps: true, 
    }
);
const SW = model('steering-wheel', SW_Schema);

module.exports = { SW };
