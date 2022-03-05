const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    HomeH1:{type:String },
    HomeH2:{type:String },
    WhyWebstie:{type:String },
    step1:{type:String },
    step2:{type:String },
    step3:{type:String },
    needConsalting:{type:String},
    aboutUs:{type:String},
    whatIsSeo:{type:String},
    SeoMazaya:{type:String},
    exclusive:{type:String},
    exclusiveMazaya:{type:Array}
})

const Texts = mongoose.models.texts || mongoose.model('texts' , exSchema);

module.exports = Texts;