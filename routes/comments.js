var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var sanitizer = require("sanitizer");
var Comment = require("../models/comment");

//========================================
//          COMMENTS ROUTES
//         USING RESTFUL ROUTES
//========================================

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

//NEW ROUTE
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.render("comments/new", { campground: foundCampground});
        }
    });
});

router.post("/", isLoggedIn, function (req, res) {
    //getting the form array
    var comment = req.body.comment;
    //sanitazing the text area
    comment.text = sanitizer.sanitize(comment.text);

    comment.author = {
        username : req.user.username,
        id: req.user._id
    };

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
                    //add username and id to comment
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

module.exports = router;