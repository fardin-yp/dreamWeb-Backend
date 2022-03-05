const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    name:{type:String ,require:true},
    number:{type:String ,require:true},
    timestamp:{type:String ,require:true},
})

const Consalting = mongoose.models.Consalting || mongoose.model('Consalting' , exSchema);

module.exports = Consalting