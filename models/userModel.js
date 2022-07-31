const mongoose = require('mongoose')

const UsersModel = new mongoose.Schema({
    email:{type:String , required:true},
    username:{type:String , required:true},
    family:{type:String , required:true},
    passwordHash:{type:String , required:true},
    meliCode:{type:String , required:true},
    number:{type:String ,required:true},
    blocked:{type:Boolean ,required:true},
    purchases:[],
    timestamp:{type:String ,require:true},
})
const Users = mongoose.models.Users || mongoose.model('Users' , UsersModel)

module.exports =  Users