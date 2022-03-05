const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    instagram:{type:String },
    telegram:{type:String },
    twitter:{type:String },
    email:{type:String },
    phone:{type:String},
})

const Links = mongoose.models.links || mongoose.model('links' , exSchema);

module.exports = Links;