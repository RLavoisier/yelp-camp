var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    //MODELS
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    sanitizer   = require("sanitizer");


//USES
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//database connection
mongoose.connect("mongodb://localhost/yelp_camp_v3");

//Fill db with seeds datas
//seedDB();

//Main route
app.get("/", function (req, res) {
    res.render("landing");
});

//========================================
//          CAMPGROUNDS ROUTES
//         USING RESTFUL ROUTES
//========================================
//======== "INDEX" ROUTE=========
app.get("/campgrounds", function(req, res){
    //get all campgrounds
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("campgrounds/index", { campgrounds: allCampgrounds });
       }
    });
});
//========== "NEW" ROUTE ==========
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});
//========== "CREATE" ROUTE ==========
app.post("/campgrounds", function(req, res){
    //Shortcut vars
    var name = req.body.camp_name;
    var image = req.body.camp_imgurl;
    var desc = req.body.camp_description;

    //creating the new Campground object
    var newCampground = {
        name: name,
        image: image,
        description: desc
    };
    // Creating the new Campground object in DB
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
        }
    });
     //Redirecting to the INDEX
    res.redirect("/campgrounds");
});

//========== "SHOW" ROUTE ==========
app.get("/campgrounds/:id", function (req, res) {
    //Getting the campground by ID and populate the comments field
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//========================================
//          COMMENTS ROUTES
//         USING RESTFUL ROUTES
//========================================

//NEW ROUTE
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
           res.redirect("/");
       }else{
           res.render("comments/new", { campground: foundCampground});
       }
    });
});

app.post("/campgrounds/:id/comments", function (req, res) {
    //getting the form array
    var comment = req.body.comment;
    //sanitazing the text area
    comment.text = sanitizer.sanitize(comment.text);

    //create comment
    Comment.create(comment, function(err, createdComment){
        if(err){
            console.log(err);
        }else{
            //retrieving the Campground
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    console.log(err);
                }else{
                    //Updating the campground
                    foundCampground.comments.push(createdComment);
                    foundCampground.save(function(err){
                        res.redirect("/campgrounds/" + req.params.id);
                    });
                }
            });
        }
    });

});



//Server Starting
app.listen(3000, function () {
    console.log("YelpCamp is running");
});

