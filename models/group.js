var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
    name   : String,
    subgrp : [{
        type: String
    }]
})

module.exports = mongoose.model("Group", groupSchema);