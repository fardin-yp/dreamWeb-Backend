const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    name:{type:String ,require:true},
    number:{type:String ,require:true},
    email:{type:String ,require:true},
    des:{type:String ,require:true},
    timestamp:{type:String ,require:true},
})

const Exclusive = mongoose.models.exclusive || mongoose.model('exclusive' , exSchema);

module.exports = Exclusive