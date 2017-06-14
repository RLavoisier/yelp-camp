var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    //MODELS
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");

//USES
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//database connection
mongoose.connect("mongodb://localhost/yelp_camp_v3");

seedDB();

// Campground.create({
//     name: "Alpes",
//     image: "http://lorempixel.com/400/200",
//     description: "Superb vue on the moutain, no water, no WC. Great night sky"
// });

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    //get all campgrounds
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("index", { campgrounds: allCampgrounds });
       }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});


app.post("/campgrounds", function(req, res){
    var name = req.body.camp_name;
    var image = req.body.camp_imgurl;
    var desc = req.body.camp_description;

    var newCampground = {
        name: name,
        image: image,
        description: desc
    };

    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
        }
    });

    res.redirect("/campgrounds");
});

app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show", {campground: foundCampground});
        }
    });
});


app.listen(3000, function () {
    console.log("YelpCamp is running");
});

