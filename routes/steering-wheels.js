const express = require('express');
const ctrl = require('../controllers/steering-wheels');
const router = express.Router();

router.get('/search',  ctrl.getPhotos);

module.exports = router;