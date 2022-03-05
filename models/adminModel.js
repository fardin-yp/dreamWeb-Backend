const mongoose = require('mongoose')

const adminModel = new mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String , require:true},
    passwordHash:{type:String , require:true},
    roll:{type:String ,required:true}
})

const Admin = mongoose.models.adminusers || mongoose.model('adminusers' , adminModel)

module.exports = Admin