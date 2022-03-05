const mongoose = require('mongoose')

const UsersModel = new mongoose.Schema({
    email:{type:String , require:true},
    username:{type:String , require:true},
    passwordHash:{type:String , require:true},
    number:{type:String ,required:true},
    blocked:{type:Boolean ,require:true},
    timestamp:{type:String ,require:true},
})
const Users = mongoose.models.Users || mongoose.model('Users' , UsersModel)

module.exports =  Users