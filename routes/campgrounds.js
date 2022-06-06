const express = require("express");

const router = express.Router();

const catchAsync = require("../Utils/catchAsync")

const camp_controller = require("../controllers/campgrounds");

const { isLoggedIn, isOwner, validateCampground } = require("../middleware");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage })
router.route("/")
    .get(catchAsync(camp_controller.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(camp_controller.createCampground));

router.get('/new', isLoggedIn, camp_controller.renderNewForm);

router.route("/:id")
    .get(catchAsync(camp_controller.showCampground))
    .put(isLoggedIn, isOwner, upload.array('image'), validateCampground, catchAsync(camp_controller.editCampground))
    .delete(isLoggedIn, isOwner, catchAsync(camp_controller.deleteCampground));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(camp_controller.renderEditForm))



module.exports = router;