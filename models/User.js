//import mongoose
const mongoose = require("mongoose");

//import mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    
    email: {type: String, require: true, unique: true}, //unique pour que deux mêmes adresses mails puissent être enregistrée
    password: {type: String, require: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);