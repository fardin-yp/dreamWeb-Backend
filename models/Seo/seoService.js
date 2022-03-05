const mongoose = require("mongoose");

const SeoSchema = mongoose.Schema({
    title:{type:String},
    price:{type:String},
    payPrice:{type:String},
    propertys:{type:Array}
});

const SeoService = mongoose.models.seoService || mongoose.model('seoService' , SeoSchema)


module.exports = SeoService