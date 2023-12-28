const { SW } = require('../db/models/steering_wheels');
const { ctrlWrapper} = require('../helpers');
const { mongoose } = require("mongoose");

const getPhotos = async (req, res) => {
    try {
            const { page, per_page } = req.query;

            const currentPage = parseInt(page) || 1;
            const limit = parseInt(per_page) || 9;
            const skip = (currentPage - 1) * limit;

            const totalCount = await SW.countDocuments({});
            const data = await SW.find({}).skip(skip).limit(limit).select('name photo_url photo_description material');
            
            res.status(200).json({data, totalCount});

    } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Помилка завантаження фото. Спробуйте перезавантажити сторінку.' });
    }
};

module.exports = { getPhotos : ctrlWrapper(getPhotos), }
