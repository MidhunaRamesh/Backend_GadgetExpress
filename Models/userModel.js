const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname : String,
    lastname : String,
    email : String,
    password : String,
    phone : Number,
role:{
    type:String,
    default:"user",
}    
});
module.exports = mongoose.model("User",userSchema);