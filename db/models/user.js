const { Schema, model } = require("mongoose"); 
const Joi = require('joi').extend(require('@joi/date'));

const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const now = new Date();

// ----- СХЕМА МОДЕЛІ ДАНИХ КОЛЕКЦІЇ "USERS" ---------------------------------------------------------------------------------
const userSchema = new Schema(
    {
        //дані з форми регістрації
        name: {
            type: String,
            required: [true, 'Set name for user'],
            minlength: 2,
            maxlength: 30,
        },
        password: {
            type: String,
            required: [true, 'Set password for user'],
            minlength: 6,
        },
        email: {
            type: String,
            required: [true, 'Email is required: example@mail.com'],
            match: emailRegExp,
            unique: true,
        },
        birthdate: {
            type: Date,
            required: [true, 'Birthdate is required'],
            default: now,
        },

        //дані з UserInfoModal (профайл юзера)
        avatarURL:{
            type: String,
            required: [true, 'Avatar url is required'],
            default: 'https://res.cloudinary.com/dxvnh0oip/image/upload/v1695434633/avatars/User_vzgcyg.png',
        }, 

        //дані для авторизації та верифікації
        token: {
            type : String,
            default: ""
        },

        subscribeStatus: {
            type: Boolean,
            default: false,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },

    },
    {  
        versionKey: false,
        timestamps: true,
    } 
);

const User = model('User', userSchema);




// ----- СХЕМИ ВАЛІДАЦІЇ ДАНИХ В ТІЛІ HTTP-запиту ДО КОЛЕКЦІЇ USERS (кастомні повідомлення про помилки)----------------------------
const signUpSchema = Joi.object({
    name : Joi.string().required().min(2).max(30).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required name field";
                                    break;
                    case "string.empty":
                                    err.message = "name field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `name field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `name field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
        }),
    password: Joi.string().required().min(6).error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required password field";
                                    break;
                    case "string.empty":
                                    err.message = "password field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `password field should have at least ${err.local.limit} characters!`;
                                    break;
                    default:
                                    break;
                    }
            });
            return errors;
        }),
    email: Joi.string().pattern(emailRegExp).required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required email field";
                                    break;
                    case "string.empty":
                                    err.message = "email field should not be empty!";
                                    break;
                    case "string.pattern.base" :
                                    err.message = "email field must be a valid email in format example@mail.com";
                                    break;
                    default:
                                    break;
                    }
            });
            return errors;
        }),
    birthdate: Joi.date().format('MM/DD/YYYY').required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "date.format":
                                err.message = "wrong birthdate format. Format MM/DD/YYYY is required";
                                break;
                case "any.required": 
                                err.message = "missing required birthdate field";
                                break;
                default:
                                break;
            }
        });
        return errors; 
    }),
});

const signInSchema = Joi.object({
    email: Joi.string().pattern(emailRegExp).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required": 
                                err.message = "missing required email field";
                                break;
                case "string.empty":
                                err.message = "email field should not be empty!";
                                break;
                case "string.pattern.base" :
                                err.message = "email field must be a valid email!";
                                break;
                default:
                                break;
                }
        });
        return errors;
        }),
    password: Joi.string().required().min(6).error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required password field";
                                    break;
                    case "string.empty":
                                    err.message = "password field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `password field should have at least ${err.local.limit} characters!`;
                                    break;
                    default:
                                    break;
                    }
            });
            return errors;
        }),
});

const updateSchema = Joi.object({
    name : Joi.string().min(2).max(30).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                    case "string.empty":
                                    err.message = "name field should not be empty!";
                                    break;
                    case "string.min":
                                    err.message = `name field should have at least ${err.local.limit} characters!`;
                                    break;
                    case "string.max":
                                    err.message = `name field should have ${err.local.limit} characters maximum!`;
                                    break;
                    default:
                                    break;
                }
        });
        return errors;
    }),

})

const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegExp).required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required field email";
                                    break;
                    case "string.empty":
                                    err.message = "email field should not be empty!";
                                    break;
                    case "string.pattern.base" :
                                    err.message = "email field must be a valid email!";
                                    break;
                    default:
                                        break;
                    }
            });
            return errors;
        }),
});

const schemas = {
    signUpSchema,
    signInSchema,
    updateSchema,
    emailSchema,
}


module.exports = { User, schemas, };
