const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require("../models/user.js");
const catchAsync = require("../Utils/catchAsync");
const user_controller = require("../controllers/users")
router.route('/register')
    .get(user_controller.renderRegisterForm)
    .post(catchAsync(user_controller.registerUser));

router.route('/login')
    .get(user_controller.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user_controller.loginUser);

router.get('/logout', user_controller.logoutUser);

module.exports = router;