const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    name:{type:String ,require:true},
    message:{type:String ,require:true},
    email:{type:String ,require:true},
    des:{type:String ,require:true},
    timestamp:{type:String ,require:true},
})

const Contact = mongoose.models.contact || mongoose.model('contact' , exSchema);

module.exports = Contact