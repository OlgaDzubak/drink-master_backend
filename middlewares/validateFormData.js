// const { httpError } = require('../helpers');

  
// const validateFormData = (schema) => {

//   const func = (req, res, next) => {
      
//         console.log(req.body);
//         if (!Object.keys(req.body).length)
//         {            
//             next(httpError(400, "missing fields"));
//         }
//         else
//         {
//             const { error } = schema.validate(req.body);
//             if (error) { 
//                 next(httpError(400, error.message)); 
//             };
//         }
//         next();
//     }
//     return func;
// }

// module.exports = validateFormData;