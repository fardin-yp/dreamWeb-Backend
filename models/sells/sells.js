const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    buyer:{type:String ,required:true},
    price:{type:String ,required:true},
    product:{},
    email:{type:String ,required:true},
    description:{type:String},
    number:{type:String ,required:true},
    meliCode:{type:String ,required:true},
    date:{type:String ,required:true},
    month:{type:String ,required:true},
    year:{type:String ,required:true},
    confirmation:{type:Boolean ,required:true},
    Tracking:{type:Number ,required:true},
    category:{type:String ,required:true}
},{timestamps:true})

const Sells = mongoose.models.sells || mongoose.model('sells' , exSchema);

module.exports = Sells;