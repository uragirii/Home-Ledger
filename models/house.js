var mongoose = require("mongoose");

var houseSchema = new mongoose.Schema({
    name    : String,
    ledgers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Ledger" 
        }
    ] 
})

module.exports = mongoose.model("House", houseSchema)
