const User = require("../models/user.js");

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async(req, res) => {
    try {
        const { username, email } = req.body.user;
        const { password } = req.body;
        const user = new User({ username, email });
        const reguser = await User.register(user, password);
        //console.log(reguser);
        req.login(reguser, err => {
            if (err) return next(err);
            req.flash('success', "Welcome to Yelp Camp!");
            res.redirect("/campgrounds");
        })

    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/register');
    }
    //reguser.save();
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!')
    const requestedUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(requestedUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!');
    res.redirect('/campgrounds');
};