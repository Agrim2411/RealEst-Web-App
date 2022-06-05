const Campground = require("./models/campground.js");
const Review = require("./models/review.js");
const { validateCampSchema, validateReviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; //.split("?").shift();
        // console.log(req.originalUrl);
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = validateCampSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.isOwner = async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground.owner._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = validateReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}