var express                     = require("express"),
    app                         = express(),
    bodyParser                  = require("body-parser"),
    mongoose                    = require("mongoose"),
    //MODELS
    seedDB                      = require("./seeds"),
    sanitizer                   = require("sanitizer"),
    passport                    = require("passport"),
    LocalStrategy               = require("passport-local"),
    methodOverride              = require("method-override");
    User                        = require("./models/user"),
    session                     = require("express-session");

//Routers
var campGroundsRoutes           = require("./routes/campgrounds");
var commentsRoutes              = require("./routes/comments");
var indexRoutes                 = require("./routes/index");

//USES
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//database connection
mongoose.connect("mongodb://localhost/yelp_camp_v6");

//Fill db with seeds datas
//seedDB();

//PASSPORT CONFIGURATION
app.use(session({
    secret: "Yelp c@mp for the win",
    resave: false,
    saveUninitialized: false,
    store: require("mongoose-session")(mongoose)
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//Main route
app.get("/", function (req, res) {
    res.render("landing");
});

//routes
app.use("/campgrounds", campGroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(indexRoutes);


//Server Starting
app.listen(3000, function () {
    console.log("YelpCamp is running");
});

