const express = require('express');
const router = express.Router();
const zoos = require('../controllers/zoos');
const catchAsync = require('../Utils/catchAsync');
const { isLoggedIn, isAuthor, validateZoo } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Zoo = require('../models/zoo');

router.route('/')
    .get(catchAsync(zoos.index))
    .post(isLoggedIn, upload.array('image'), validateZoo, catchAsync(zoos.createZoo))


router.get('/new', isLoggedIn, zoos.renderNewForm)

router.route('/:id')
    .get(catchAsync(zoos.showZoo))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateZoo, catchAsync(zoos.updateZoo))
    .delete(isLoggedIn, isAuthor, catchAsync(zoos.deleteZoo));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(zoos.renderEditForm))



module.exports = router;