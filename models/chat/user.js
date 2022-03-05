const mongoose = require("mongoose");

const userChat = new mongoose.Schema({
    name:{type:String ,require:true},
    email:{type:String ,require:true}
})

module.exports =mongoose.models.userChat || mongoose.model("userChat" , userChat);