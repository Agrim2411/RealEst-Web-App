const express = require("express");

const router = express.Router({ mergeParams: true });

const catchAsync = require("../Utils/catchAsync")

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")

const review_controller = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(review_controller.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review_controller.deleteReview));

module.exports = router;