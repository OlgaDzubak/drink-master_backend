const { isValidObjectId } = require("mongoose");

const validateId = (req, res, next) => {
    if (!isValidObjectId(req.params.contactId)){
        res.status(404).json({message : "Not found"});
        return;
    }
    next();
}

module.exports = validateId;