const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    name:{type:String ,required:true},
    price:{type:String ,required:true},
    email:{type:String ,required:true},
    phone:{type:String ,required:true},
    information:{type:Array ,require:true},
    des:{type:String ,required:true},
    timestamp:{type:String},
    site:{type:String},
    date:{type:String ,required:true}
})

const Sells = mongoose.models.sells || mongoose.model('sells' , exSchema);

module.exports = Sells;