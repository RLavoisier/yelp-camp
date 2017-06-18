var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//========================================
//          CAMPGROUNDS ROUTES
//         USING RESTFUL ROUTES
//========================================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

//======== "INDEX" ROUTE=========
router.get("/", function(req, res){
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
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});
//========== "CREATE" ROUTE ==========
router.post("/", isLoggedIn, function(req, res){
    //Shortcut vars
    var name = req.body.camp_name;
    var image = req.body.camp_imgurl;
    var desc = req.body.camp_description;

    //creating the new Campground object
    var newCampground = {
        name: name,
        image: image,
        description: desc,
        author:{
            id: req.user._id,
            username: req.user.username
        }
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
    res.redirect("/");
});

//========== "SHOW" ROUTE ==========
router.get("/:id", function (req, res) {
    //Getting the campground by ID and populate the comments field
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//========== "EDIT" ROUTE ==========
router.get("/:id/edit", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
})

//========== "UPDATE" ROUTE ==========
router.put("/:id", function(req, res){
    console.log("PUT");
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    })
});

module.exports = router;