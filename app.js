var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

var campGrounds = [
    {
        name: "Salmon Creek",
        image: "http://lorempixel.com/400/200"
    },
    {
        name: "Indre",
        image: "http://lorempixel.com/400/200"
    },
    {
        name: "Alpes",
        image: "http://lorempixel.com/400/200"
    },
    {
        name: "Salmon Creek",
        image: "http://lorempixel.com/400/200"
    },
    {
        name: "Indre",
        image: "http://lorempixel.com/400/200"
    },
    {
        name: "Alpes",
        image: "http://lorempixel.com/400/200"
    },
    {
        name: "Salmon Creek",
        image: "http://lorempixel.com/400/200"
    },
    {
        name: "Indre",
        image: "http://lorempixel.com/400/200"
    },
    {
        name: "Alpes",
        image: "http://lorempixel.com/400/200"
    }
];

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", { campgrounds: campGrounds });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});


app.post("/campgrounds", function(req, res){
    var name = req.body.camp_name;
    var image = req.body.camp_imgurl;

    var newCampground = {
        name: name,
        image: image
    };

    campGrounds.push(newCampground);

    res.redirect("/campgrounds");
});

app.listen(3000, function () {
    console.log("YelpCamp is running");
});

