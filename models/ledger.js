var mongoose = require("mongoose");

var ledgerSchema = new mongoose.Schema({
    date    : Date,
    value   : Number,
    payment : String,
    group   : String,
    subGrp  : String,
    notes   : String
})

module.exports = mongoose.model("Ledger", ledgerSchema);
