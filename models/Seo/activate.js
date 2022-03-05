const mongoose = require("mongoose");

const SeoSchema = mongoose.Schema({
    active:{type:Boolean},
});

const Seo = mongoose.models.activate || mongoose.model('activate' , SeoSchema)


module.exports = Seo