var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username : String,
    email    : String,
    password : String,
    houses   :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "House"
        }
    ]
});

userSchema.plugin(passportLocalMongoose, {usernameField : "email"});
module.exports = mongoose.model("User", userSchema)

