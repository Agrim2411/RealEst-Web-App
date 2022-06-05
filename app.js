if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//console.log(process.env.SECRET);
const express = require("express");
const morgan = require('morgan')
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./Utils/ExpressError")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const CampGroundsRoutes = require("./routes/campgrounds.js");
const ReviewsRoutes = require("./routes/reviews.js");
const UsersRoutes = require("./routes/users.js");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    })
    .then(() => { console.log("Mongo Connection Open!") })
    .catch((err) => { console.log("Error!!", err) })


app.engine('ejs', ejsMate)

app.set("view engine", 'ejs')

app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.get("/fakeUser", async(req, res) => {
    const user = new User({ email: "abcd@gmail.com", username: 'abcdfake' });
    const reguser = await User.register(user, 'VPTSWB');
    res.send(reguser);
})
app.use("/campgrounds", CampGroundsRoutes);
app.use("/campgrounds/:id/reviews", ReviewsRoutes);
app.use('/', UsersRoutes);
morgan('tiny')
    //app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
})
app.use((err, req, res, next) => {
    if (!err.statusCode)
        err.statusCode = 404;
    if (!err.message)
        err.message = "Something Went Wrong!"
    res.status(err.statusCode).render('error', { err })
})
app.listen(3000, (req, res) => {
    console.log("On PORT 3000!");
})