const mongoose = require('mongoose');
const Schema = mongoose.Schema

const comments = new Schema({
    id:Schema.ObjectId,
    ip:{type:String ,required:false},
    name:{type:String ,required:true},
    email:{type:String ,required:true},
    des:{type:String ,required:true},
    admin:{type:Boolean ,required:true},
    answer:{type:String },
    time:{type:String ,required:true}
},{timestamps:true});

const ArticleModel = mongoose.Schema({
    title:{type:String ,require:true},
    image:{type:String ,require:true},
    info:{type:String ,require:true},
    timestamp:{type:String ,require:true},
    comments:[comments],
    views:{type:String ,require:true}
})

const Articles = mongoose.models.Articles || mongoose.model('Articles' , ArticleModel);
module.exports = Articles 