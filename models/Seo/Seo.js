const mongoose = require("mongoose");

const SeoSchema = mongoose.Schema({
    title:{type:String},
    route:{type:String},
    description:{type:String},
    keywords:{type:String},
    ogSiteName:{type:String},
    ogType:{type:String},
    ogUrl:{type:String}
});

const Seo = mongoose.models.seo || mongoose.model('seo' , SeoSchema)


module.exports = Seo