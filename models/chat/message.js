const mongoose = require("mongoose");

const userMessage = new mongoose.Schema({
    conversationId:{type:String ,require:true},
    sender:{type:String ,require:true},
    text:{type:String ,require:true}
},{timestamps:true})

module.exports =mongoose.models.userMessage || mongoose.model("userMessage" , userMessage);