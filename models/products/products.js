const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comments = new Schema({
    id:Schema.ObjectId,
    ip:{type:String ,required:false},
    name:{type:String ,required:true},
    email:{type:String ,required:true},
    des:{type:String ,required:true},
    admin:{type:Boolean ,required:true},
    answer:{type:String },
    time:{type:String ,required:true}
},{timestamps:true})

const productModel = new mongoose.Schema({
    name:{type:String ,required:true},
    image:{type:String ,required:true},
    price:{type:String },
    off:{type:Number },
    category:{type:String ,reauired:true},
    link:{type:String },
    Property:{type:String},
    comments:[comments],
    description:{type:String},
    timestamp:{type:String ,required:true},
})

const Products = mongoose.models.products || mongoose.model('products' , productModel)

module.exports = Products