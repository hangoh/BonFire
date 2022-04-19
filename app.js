
require('dotenv').config();


const express = require('express');
const app =express();
const path = require('path');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')
const helmet = require("helmet");

const placesRouter = require("./routes/placesRoute")
const reviewsRouter = require("./routes/reviewsRoute")
const userRouter = require("./routes/userRoute")
const mongoSanitizer = require('express-mongo-sanitize')

//const mongodbURL = process.env.MONGOURL //for production
mongoose.connect('mongodb://localhost:27017/bonfire');

app.listen(3000, ()=>{
    console.log("start port server 3000");
});

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error: "));
db.once('open',()=>{
    console.log("database connect from app.js");
});

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(urlencoded({extended:true}));
app.use(methodOverride('_method'));
const sessionConfig = {
    secret:"normalsecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        //7*24*60*60*1000 == 1 week time 
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        HttpOnly: true
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(mongoSanitizer())

app.use(passport.session())
app.use(passport.initialize())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://a.tiles.mapbox.com",
    "https://b.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: [ "'unsafe-inline'","'self'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dcc6h5ouf/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

///////////////////////////////////////////////////////  MiddleWare  ///////////////////////////////////////////////////
app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

///////////////////////////////////////////////////////  Routes  ////////////////////////////////////////////////////////
app.get('/',(req,res,next)=>{
    res.render('home')
})
app.use("/places",placesRouter)
app.use("/places/:id/reviews", reviewsRouter)
app.use('/',userRouter)

app.all('*',(req,res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next) => {
    const {statusCode=500} = err
    if (!err.message){
        err.message = "Oh No!! Something Went Wrong!"
    }
    res.status(statusCode).render('error', {err})
})
