var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport"),
LocalStrategy = require("passport-local");
app = express()

mongoose.connect("mongodb://localhost:27017/home-ledger", {useNewUrlParser:true});

Group = require("./models/group");
Ledger = require("./models/ledger");
User = require("./models/user");
House = require("./models/house");
app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


app.use(require("express-session")({
    secret: "lol idk what to type here",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });


app.get("/", function(req, res){
    res.render("home");
})

app.get("/signup", function(req, res){
    res.render("signup");
})

app.get("/login", function(req, res){
    res.render("login");
})

// Then multiple houses
app.get("/house", isLoggedIn,function(req, res){
    User.findById(req.user._id).populate({path : "houses", populate : {path : "ledgers"}}).exec(function(err, users){
        if(err){
            console.log(err)
        }
        else{
            res.render("house", {houses : users.houses})
        }
    })
})
app.get("/:houseid/ledger/new", isLoggedIn,function(req, res){
    res.render("new", {houseId : req.params.houseid})
})

app.get("/logout", function(req, res){
    req.logout();
    console.log("Logged OUt");
    res.redirect("/");
})

// ------------------------------POST REQUESTS---------------

app.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username, email: req.body.email, houses : []});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/house");
        });
    });
})

app.post("/login", passport.authenticate("local", {
    successRedirect : "/house",
    failureRedirect : "/signup"
}), function(req, res){
    res.redirect(req.header('Referer'));
});


app.post("/:userid/house/new", isLoggedIn,function(req, res){
    User.findById(req.params.userid, function(err, newUser){
        if(err){
            console.log(err);
        }
        else{
            House.create({"name" : req.body.name, "ledgers" : []}, function(err, newhouse){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("New House Created")
                    newUser.houses.push(newhouse)
                    newUser.save()
                    res.redirect("/house")
                }
            })
        }
    })
})

// Get the submitted Ledger here, 
app.post("/:houseid/ledger/new", isLoggedIn,function(req, res){
    House.findById(req.params.houseid, function(err, house){
        if(err){
            console.log(err)
        }
        else{
            Ledger.create(req.body, function(err, newLedger){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("A new Entry has been created")
                    house.ledgers.push(newLedger)
                    house.save()
                    res.redirect("/house")
                }
            })
        }
    })
})

// Get the new group from the modal of the Ledger new
app.post("/group/new", isLoggedIn,function(req, res){
    console.log(req.body)
    Group.create({name : req.body.groupName, subgrp : req.body.subGrpName}, function(err, newGroup){
        if (err){
            console.log(err);
            res.send("ERR")
        }
        else{
            console.log("Added a new Group")
            res.send("DONE")
        }
    })
})  

app.delete("/:houseid/:ledgerid", function(req, res){
    House.updateOne({_id : req.param.houseid}, {$pull : {'ledgers' : {'_id' : req.params.ledgerid}}}, function(err, house){
        if (err){
            console.log(err)
        }
        else{
            Ledger.findByIdAndDelete(req.params.ledgerid, function(err){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Deleted Ledger")
                    res.redirect("/house")
                }
            })
        }
    })
})

function getLedgers(houses){
    newHouses = []
    houses.forEach(function(house){
        newHouse = {
            "_id" : house._id,
            "ledgers" : [],
            "name" : house.name,
            "__v" : house.__v
        }
        house.ledgers.forEach(function(ledger){
            var d = new Date()
            if (ledger.date.getMonth () === d.getMonth()){
                newHouse["ledgers"].push(ledger)
            }
        })
        newHouses.push(newHouse)
    })
    return newHouses
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
};

function isAdmin(req, res, next){
    if(req.isAuthenticated() && req.user.username === "cherub"){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

app.listen(3000, function(){
    console.log("Server has started")
})