const Review = require("../models/review.js");
const Campground = require("../models/campground.js");

module.exports.createReview = async(req, res) => {
    const id = req.params.id;
    const { rating, body } = req.body.review;
    const review = new Review({ rating, body });
    review.author = req.user._id;
    const campground = await Campground.findById(id);
    await campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
};